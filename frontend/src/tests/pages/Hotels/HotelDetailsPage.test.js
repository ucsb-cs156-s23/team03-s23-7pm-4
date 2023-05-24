import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import HotelDetailsPage from "main/pages/Hotels/HotelDetailsPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { hotelFixtures } from "fixtures/hotelFixtures";
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
            name: "The Ritz-Carlton",
            address: "8301 Hollister Ave, Santa Barbara, CA 93117",
            description: "a luxury resort in Santa Barbara set on 78 acres with two natural beaches, a holistic spa and seasonal cuisine."
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("HotelDetailsPage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    const testId = "HotelTable";

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
        axiosMock.onGet("/api/hotels", { params: { id: 17} }).reply(200, {
            id: 17,
            name: "The Ritz-Carlton",
            address: "8301 Hollister Ave, Santa Barbara, CA 93117",
            description: "a luxury resort in Santa Barbara set on 78 acres with two natural beaches, a holistic spa and seasonal cuisine."
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HotelDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders without crashing for admin user", () => {
        setupAdminUser();
        axiosMock.onGet("/api/hotels", { params: { id: 17 } }).reply(200, {
            id: 17,
            name: "The Ritz-Carlton",
            address: "8301 Hollister Ave, Santa Barbara, CA 93117",
            description: "a luxury resort in Santa Barbara set on 78 acres with two natural beaches, a holistic spa and seasonal cuisine."
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HotelDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("loads correct hotel with buttons", async () => {
        axiosMock.onGet("/api/hotels", { params: { id: 17 } }).reply(200, {
            id: 17,
            name: "The Ritz-Carlton",
            address: "8301 Hollister Ave, Santa Barbara, CA 93117",
            description: "a luxury resort in Santa Barbara set on 78 acres with two natural beaches, a holistic spa and seasonal cuisine."
        });

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HotelDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(screen.getByText("The Ritz-Carlton")).toBeInTheDocument();
        expect(screen.getByText("8301 Hollister Ave, Santa Barbara, CA 93117")).toBeInTheDocument();
        expect(screen.getByText("a luxury resort in Santa Barbara set on 78 acres with two natural beaches, a holistic spa and seasonal cuisine.")).toBeInTheDocument();

        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(screen.queryByText("Details")).not.toBeInTheDocument();
    });

});