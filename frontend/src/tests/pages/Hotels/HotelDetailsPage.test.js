import { render, screen } from "@testing-library/react";
import HotelDetailsPage from "main/pages/Hotels/HotelDetailsPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 1,
            name: "The Ritz-Carlton",
            address: "8301 Hollister Ave, Santa Barbara, CA 93117",
            description: "a luxury resort in Santa Barbara set on 78 acres with two natural beaches, a holistic spa and seasonal cuisine."
        }),
        useNavigate: (x) => { mockNavigate(x); return null; }
    };
});

/*jest.mock('main/utils/hotelUtils', () => {
    return {
        __esModule: true,
        hotelUtils: {
            getById: (_id) => {
                return {
                    hotel: {
                        id: 1,
                        name: "The Ritz-Carlton",
                        address: "8301 Hollister Ave, Santa Barbara, CA 93117",
                        description: "a luxury resort in Santa Barbara set on 78 acres with two natural beaches, a holistic spa and seasonal cuisine."
                    }
                }
            }
        }
    }
});*/

describe("HotelDetailsPage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/hotels", { params: { id: 1 } }).reply(200, {
            id: 1,
            name: "The Ritz-Carlton",
            address: "8301 Hollister Ave, Santa Barbara, CA 93117",
            description: "a luxury resort in Santa Barbara set on 78 acres with two natural beaches, a holistic spa and seasonal cuisine."
        });
    };

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/hotels", { params: { id: 1 } }).reply(200, {
            id: 1,
            name: "The Ritz-Carlton",
            address: "8301 Hollister Ave, Santa Barbara, CA 93117",
            description: "a luxury resort in Santa Barbara set on 78 acres with two natural beaches, a holistic spa and seasonal cuisine."
        });
    };
    

    const queryClient = new QueryClient();
    test("renders without crashing for regular user", () => {
        setupUserOnly()
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HotelDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders without crashing for admin", () => {
        setupAdminUser()
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HotelDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("loads the correct fields, and no buttons for regular user", async () => {
        setupUserOnly()
        render(
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

    test("loads the correct fields, and no buttons for admin", async () => {
        setupAdminUser()
        render(
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