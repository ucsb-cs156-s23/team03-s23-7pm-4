import { render, screen, act, waitFor, fireEvent } from "@testing-library/react";
import MovieEditPage from "main/pages/Movies/MovieEditPage";
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
        id: 3
    }),
    useNavigate: () => mockNavigate
}));

const mockUpdate = jest.fn();
jest.mock('main/utils/movieUtils', () => {
    return {
        __esModule: true,
        movieUtils: {
            update: (_movie) => {return mockUpdate();},
            getById: (_id) => {
                return {
                    movie: {
                        id: 3,
                        name: "High School Musical",
                        year: "2006",
                        summary: "Basketball player Troy and smart student Gabriella join their school musical"
                    }
                }
            }
        }
    }
});


describe("MovieEditPage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither); 

    const queryClient = new QueryClient();

    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MovieEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("loads the correct fields", async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MovieEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByTestId("MovieForm-name")).toBeInTheDocument();
        expect(screen.getByDisplayValue('High School Musical')).toBeInTheDocument();
        expect(screen.getByDisplayValue('2006')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Basketball player Troy and smart student Gabriella join their school musical')).toBeInTheDocument();
    });

    test("redirects to /movies on submit", async () => {

        const restoreConsole = mockConsole();

        mockUpdate.mockReturnValue({
            "movie": {
                id: 3,
                name: "Finding Nemo",
                year: "2003",
                summary: "Nemo is lost and must be found"
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MovieEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();

        const yearInput = screen.getByLabelText("Year");
        expect(yearInput).toBeInTheDocument();

        const summaryInput = screen.getByLabelText("Summary");
        expect(summaryInput).toBeInTheDocument();

        const updateButton = screen.getByText("Update");
        expect(updateButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(nameInput, { target: { value: 'Finding Nemo' } })
            fireEvent.change(yearInput, { target: { value: '2003' } })
            fireEvent.change(summaryInput, { target: { value: 'Nemo is lost and must be found' } })
            fireEvent.click(updateButton);
        });

        await waitFor(() => expect(mockUpdate).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/movies/list"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `updatedMovie: {"movie":{"id":3,"name":"Finding Nemo","year":"2003","summary":"Nemo is lost and must be found"}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


