import { render, screen, waitFor } from "@testing-library/react";
import HotelIndexPage from "main/pages/Hotels/HotelIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const mockDelete = jest.fn();
jest.mock('main/utils/hotelUtils', () => {
    return {
        __esModule: true,
        hotelUtils: {
            del: (id) => {
                return mockDelete(id);
            },
            get: () => {
                return {
                    nextId: 5,
                    hotels: [
                        {
                            "id": 1,
                            "name": "The Ritz-Carlton",
                            "address": "8301 Hollister Ave, Santa Barbara, CA 93117",
                            "city": "Isla Vista",
                            "state": "CA",
                            "zip": "93117",
                            "description": "a luxury resort in Santa Barbara set on 78 acres with two natural beaches, a holistic spa and seasonal cuisine."
                        },
                    ]
                }
            }
        }
    }
});


describe("HotelIndexPage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HotelIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders correct fields", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HotelIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const createHotelButton = screen.getByText("Create Hotel");
        expect(createHotelButton).toBeInTheDocument();
        expect(createHotelButton).toHaveAttribute("style", "float: right;");

        const name = screen.getByText("The Ritz-Carlton");
        expect(name).toBeInTheDocument();

        const address = screen.getByText("8301 Hollister Ave, Santa Barbara, CA 93117");
        expect(address).toBeInTheDocument();

        const description = screen.getByText("a luxury resort in Santa Barbara set on 78 acres with two natural beaches, a holistic spa and seasonal cuisine.");
        expect(description).toBeInTheDocument();

        expect(screen.getByTestId("HotelTable-cell-row-0-col-Delete-button")).toBeInTheDocument();
        expect(screen.getByTestId("HotelTable-cell-row-0-col-Details-button")).toBeInTheDocument();
        expect(screen.getByTestId("HotelTable-cell-row-0-col-Edit-button")).toBeInTheDocument();
    });

    test("delete button calls delete and reloads page", async () => {

        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HotelIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const name = screen.getByText("The Ritz-Carlton");
        expect(name).toBeInTheDocument();

        const address = screen.getByText("8301 Hollister Ave, Santa Barbara, CA 93117");
        expect(address).toBeInTheDocument();

        const description = screen.getByText("a luxury resort in Santa Barbara set on 78 acres with two natural beaches, a holistic spa and seasonal cuisine.");
        expect(description).toBeInTheDocument();

        const deleteButton = screen.getByTestId("HotelTable-cell-row-0-col-Delete-button");
        expect(deleteButton).toBeInTheDocument();

        deleteButton.click();

        expect(mockDelete).toHaveBeenCalledTimes(1);
        expect(mockDelete).toHaveBeenCalledWith(1);

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/hotels"));


        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage = `HotelIndexPage deleteCallback: {"id":1,"name":"The Ritz-Carlton","address":"8301 Hollister Ave, Santa Barbara, CA 93117","description":"a luxury resort in Santa Barbara set on 78 acres with two natural beaches, a holistic spa and seasonal cuisine."}`;
        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


