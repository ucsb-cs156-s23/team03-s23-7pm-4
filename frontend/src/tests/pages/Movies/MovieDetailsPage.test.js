import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import MovieDetailsPage from "main/pages/Movies/MovieDetailsPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { movieFixtures } from "fixtures/movieFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 17,
            name: "Spiderman",
            year: "2002",
            summary: "Peter Parker gets bitten by a spider"
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});
describe("MovieDetailsPage tests", () => {
    const axiosMock =new AxiosMockAdapter(axios);

    const testId = "MovieTable";

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };
    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };
    const queryClient = new QueryClient();
    test("renders without crashing for regular user", () => {
        setupUserOnly();
        axiosMock.onGet("/api/movies", { params: { id: 17} }).reply(200, {
            id: 17,
            name: "Spiderman",
            year: "2002",
            summary: "Peter Parker gets bitten by a spider"
        });
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MovieDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });
    test("renders without crashing for admin user", () => {
        setupAdminUser();
        axiosMock.onGet("/api/movies", { params: { id: 17 } }).reply(200, {
            id: 17,
            name: "Spiderman",
            year: "2002",
            summary: "Peter Parker gets bitten by a spider"
        });
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MovieDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });
    test("loads correct movie with buttons", async () => {
        axiosMock.onGet("/api/movies", { params: { id: 17 } }).reply(200, {
            id: 17,
            name: "Spiderman",
            year: "2002",
            summary: "Peter Parker gets bitten by a spider"
        });
        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MovieDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByText("Spiderman")).toBeInTheDocument();
        expect(screen.getByText("2002s")).toBeInTheDocument();
        expect(screen.getByText("Peter Parker gets bitten by a spider")).toBeInTheDocument();

        const deleteButton = getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();

        const editButton = getByTestId(`${testId}-cell-row-0-col-Edit-button`);
        expect(editButton).toBeInTheDocument();
        
        const detailsButton = getByTestId(`${testId}-cell-row-0-col-Details-button`);
        expect(detailsButton).toBeInTheDocument();
    });
});
