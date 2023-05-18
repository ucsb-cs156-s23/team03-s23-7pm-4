import { render, screen, act, waitFor, fireEvent } from "@testing-library/react";
import HotelEditPage from "main/pages/Hotels/HotelEditPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";
import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        id: 2
    }),
    useNavigate: () => mockNavigate
}));

const mockUpdate = jest.fn();
jest.mock('main/utils/hotelUtils', () => {
    return {
        __esModule: true,
        hotelUtils: {
            update: (_hotel) => {return mockUpdate();},
            getById: (_id) => {
                return {
                    hotel: {
                        id: 2,
                        name: "Riviera Beach House",
                        address:"121 State St, Santa Barbara, CA 93101",
                        description: "Set in a trendy Funk Zone neighborhood, this chic adobe-style hotel with views of the Santa Ynez Mountains is a 4-minute walk from Stearns Wharf"
                    }
                }
            }
        }
    }
});


describe("HotelEditPage tests", () => {
    const axiosMock =new AxiosMockAdapter(axios);
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither); 
    
    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HotelEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("loads the correct fields", async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HotelEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByTestId("HotelForm-name")).toBeInTheDocument();
        expect(screen.getByDisplayValue('Riviera Beach House')).toBeInTheDocument();
        expect(screen.getByDisplayValue('121 State St, Santa Barbara, CA 93101')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Set in a trendy Funk Zone neighborhood, this chic adobe-style hotel with views of the Santa Ynez Mountains is a 4-minute walk from Stearns Wharf')).toBeInTheDocument();
    });

    test("redirects to /hotels on submit", async () => {

        const restoreConsole = mockConsole();

        mockUpdate.mockReturnValue({
            "hotel": {
                id: 2,
                name: "Best Western Plus",
                address: "5620 Calle Real, Goleta, CA 93117",
                description: "Off Highway 101 and set in landscaped gardens, this down-to-earth hotel is 2.5 miles from Santa Barbara Airport"
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HotelEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();

        const addressInput = screen.getByLabelText("Address");
        expect(addressInput).toBeInTheDocument();

        const descriptionInput = screen.getByLabelText("Description");
        expect(descriptionInput).toBeInTheDocument();

        const updateButton = screen.getByText("Update");
        expect(updateButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(nameInput, { target: { value: 'Best Western Plus' } })
            fireEvent.change(addressInput, { target: { value: '5620 Calle Real, Goleta, CA 93117' } })
            fireEvent.change(descriptionInput, { target: { value: 'Off Highway 101 and set in landscaped gardens, this down-to-earth hotel is 2.5 miles from Santa Barbara Airport' } })
            fireEvent.click(updateButton);
        });

        await waitFor(() => expect(mockUpdate).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/hotels"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `updatedHotel: {"hotel":{"id":2,"name":"Best Western Plus","address":"5620 Calle Real, Goleta, CA 93117","description":"Off Highway 101 and set in landscaped gardens, this down-to-earth hotel is 2.5 miles from Santa Barbara Airport"}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});