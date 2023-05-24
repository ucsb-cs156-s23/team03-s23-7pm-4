import { render, waitFor, fireEvent } from "@testing-library/react";
import MovieCreatePage from "main/pages/Movies/MovieCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("MovieCreatePage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MovieCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const movie = {
            id: 17,
            name: "Spider-Man",
            year: "2002",
            summary: "Peter Parker gets bitten by a spider"
        };

        axiosMock.onPost("/api/movies/post").reply( 202, movie );

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MovieCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByTestId("MovieForm-name")).toBeInTheDocument();
        });

        const nameField = getByTestId("MovieForm-name");
        const yearField = getByTestId("MovieForm-year");
        const summaryField = getByTestId("MovieForm-summary");
        const submitButton = getByTestId("MovieForm-submit");

        fireEvent.change(nameField, { target: { value: 'Spider-Man' } });
        fireEvent.change(yearField, { target: { value: '2002' } });
        fireEvent.change(summaryField, { target: { value: 'Peter Parker gets bitten by a spider' } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
            "name": "Spider-Man",
            "year": "2002",
            "summary": "Peter Parker gets bitten by a spider"
        });

        expect(mockToast).toBeCalledWith("New movie Created - id: 17 name: Spider-Man");
        expect(mockNavigate).toBeCalledWith({ "to": "/movies/list" });
    });


});


