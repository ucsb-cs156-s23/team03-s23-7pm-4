import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import RestaurantDetailsPage from "main/pages/Restaurants/RestaurantDetailsPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { restaurantFixtures } from "fixtures/restaurantFixtures";
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
            name: "Freebirds",
            description: "Burritos and nachos",
            price: "$$"
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("RestaurantDetailsPage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    const testId = "RestaurantTable";

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
        axiosMock.onGet("/api/restaurants", { params: { id: 17} }).reply(200, {
            id: 17,
            name: "Freebirds",
            description: "Burritos and nachos",
            price: "$$"
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders without crashing for admin user", () => {
        setupAdminUser();
        axiosMock.onGet("/api/restaurants", { params: { id: 17 } }).reply(200, {
            id: 17,
            name: "Freebirds",
            description: "Burritos and nachos",
            price: "$$"
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("loads correct restaurant with buttons", async () => {
        axiosMock.onGet("/api/restaurants", { params: { id: 17 } }).reply(200, {
            id: 17,
            name: "Freebirds",
            description: "Burritos and nachos",
            price: "$$"
        });

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(screen.getByText("Freebirds")).toBeInTheDocument();
        expect(screen.getByText("Burritos and nachos")).toBeInTheDocument();
        expect(screen.getByText("$$")).toBeInTheDocument();

        const deleteButton = getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).not.toBeInTheDocument();

        const editButton = getByTestId(`${testId}-cell-row-0-col-Edit-button`);
        expect(editButton).not.toBeInTheDocument();

        const detailsButton = getByTestId(`${testId}-cell-row-0-col-Details-button`);
        expect(detailsButton).not.toBeInTheDocument();

    });

});

