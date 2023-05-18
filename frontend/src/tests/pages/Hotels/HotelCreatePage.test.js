import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import HotelCreatePage from "main/pages/Hotels/HotelCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const mockAdd = jest.fn();
jest.mock('main/utils/hotelUtils', () => {
    return {
        __esModule: true,
        hotelUtils: {
            add: () => { return mockAdd(); }
        }
    }
});

describe("HotelCreatePage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HotelCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("redirects to /hotels on submit", async () => {

        const restoreConsole = mockConsole();

        mockAdd.mockReturnValue({
            "hotel": {
                id: 1,
                name: "The Ritz-Carlton",
                address: "8301 Hollister Ave, Santa Barbara, CA 93117",
                description: "a luxury resort in Santa Barbara set on 78 acres with two natural beaches, a holistic spa and seasonal cuisine."
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HotelCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();


        const addressInput = screen.getByLabelText("Address");
        expect(addressInput).toBeInTheDocument();

        const descriptionInput = screen.getByLabelText("Description");
        expect(descriptionInput).toBeInTheDocument();


        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(nameInput, { target: { value: 'The Ritz-Carlton' } })
            fireEvent.change(addressInput, { target: { value: '8301 Hollister Ave, Santa Barbara, CA 93117' } })
            fireEvent.change(descriptionInput, { target: { value: 'a luxury resort in Santa Barbara set on 78 acres with two natural beaches, a holistic spa and seasonal cuisine.' } })
            fireEvent.click(createButton);
        });

        await waitFor(() => expect(mockAdd).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/hotels"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `createdHotel: {"hotel":{"id":1,"name":"The Ritz-Carlton","address":"8301 Hollister Ave, Santa Barbara, CA 93117","description":"a luxury resort in Santa Barbara set on 78 acres with two natural beaches, a holistic spa and seasonal cuisine."}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});