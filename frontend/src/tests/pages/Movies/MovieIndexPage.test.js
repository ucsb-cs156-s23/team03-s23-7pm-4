import { render, screen, waitFor } from "@testing-library/react";
import MovieIndexPage from "main/pages/Movies/MovieIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const mockDelete = jest.fn();
jest.mock('main/utils/movieUtils', () => {
    return {
        __esModule: true,
        movieUtils: {
            del: (id) => {
                return mockDelete(id);
            },
            get: () => {
                return {
                    nextId: 5,
                    movies: [
                        {
                            "id": 3,
                            "name": "High School Musical",
                            "year": "2006",
                            "summary": "Basketball player Troy and smart student Gabriella join their school musical" 
                        },
                    ]
                }
            }
        }
    }
});


describe("MovieIndexPage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MovieIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders correct fields", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MovieIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const createMovieButton = screen.getByText("Create Movie");
        expect(createMovieButton).toBeInTheDocument();
        expect(createMovieButton).toHaveAttribute("style", "float: right;");

        const name = screen.getByText("High School Musical");
        expect(name).toBeInTheDocument();

        const year = screen.getByText("2006");
        expect(year).toBeInTheDocument();

        const summary = screen.getByText("Basketball player Troy and smart student Gabriella join their school musical");
        expect(summary).toBeInTheDocument();

        expect(screen.getByTestId("MovieTable-cell-row-0-col-Delete-button")).toBeInTheDocument();
        expect(screen.getByTestId("MovieTable-cell-row-0-col-Details-button")).toBeInTheDocument();
        expect(screen.getByTestId("MovieTable-cell-row-0-col-Edit-button")).toBeInTheDocument();
    });

    test("delete button calls delete and reloads page", async () => {

        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MovieIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const name = screen.getByText("High School Musical");
        expect(name).toBeInTheDocument();

        const year = screen.getByText("2006");
        expect(year).toBeInTheDocument();

        const summary = screen.getByText("Basketball player Troy and smart student Gabriella join their school musical");
        expect(summary).toBeInTheDocument();

        const deleteButton = screen.getByTestId("MovieTable-cell-row-0-col-Delete-button");
        expect(deleteButton).toBeInTheDocument();

        deleteButton.click();

        expect(mockDelete).toHaveBeenCalledTimes(1);
        expect(mockDelete).toHaveBeenCalledWith(3);

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/movies"));


        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage = `MovieIndexPage deleteCallback: {"id":3,"name":"High School Musical","year":"2006","summary":"Basketball player Troy and smart student Gabriella join their school musical"}`;
        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


