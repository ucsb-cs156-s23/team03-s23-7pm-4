import { fireEvent, queryByTestId, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import MovieEditPage from "main/pages/Movies/MovieEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("MovieEditPage tests", () => {

    describe("when the backend doesn't return a todo", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/movies", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            const {getByText, queryByTestId, findByText} = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MovieEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await findByText("Edit Movie");
            expect(queryByTestId("MovieForm-name")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/movies", { params: { id: 17 } }).reply(200, {
                id: 17,
                name: 'Spider-Man',
                year: "2002",
                summary: "Peter Parker gets bitten by a spider"
            });
            axiosMock.onPut('/api/movies').reply(200, {
                id: "17",
                name: 'High School Musical',
                year: "2006",
                summary: "Troy and Gabriella join the school musical"
            });
        });

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

        test("Is populated with the data provided", async () => {

            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MovieEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("MovieForm-name");

            const idField = getByTestId("MovieForm-id");
            const nameField = getByTestId("MovieForm-name");
            const yearField = getByTestId("MovieForm-year");
            const summaryField = getByTestId("MovieForm-summary");
            const submitButton = getByTestId("MovieForm-submit");

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("Spider-Man");
            expect(yearField).toHaveValue("2002");
            expect(summaryField).toHaveValue("Peter Parker gets bitten by a spider");
        });

        test("Changes when you click Update", async () => {



            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MovieEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("MovieForm-name");

            const idField = getByTestId("MovieForm-id");
            const nameField = getByTestId("MovieForm-name");
            const yearField = getByTestId("MovieForm-year");
            const summaryField = getByTestId("MovieForm-summary");
            const submitButton = getByTestId("MovieForm-submit");

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("Spider-Man");
            expect(yearField).toHaveValue("2002");
            expect(summaryField).toHaveValue("Peter Parker gets bitten by a spider");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(nameField, { target: { value: 'High School Musical' } })
            fireEvent.change(yearField, { target: { value: '2006' } })
            fireEvent.change(summaryField, { target: { value: "Troy and Gabriella join the school musical" } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled);
            expect(mockToast).toBeCalledWith("Movie Updated - id: 17 name: High School Musical");
            expect(mockNavigate).toBeCalledWith({ "to": "/movies/list" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                name: 'High School Musical',
                year: "2006",
                summary: "Troy and Gabriella join the school musical"
            })); // posted object

        });

       
    });
});


