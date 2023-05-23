import { render, waitFor, fireEvent } from "@testing-library/react";
import HotelCreatePage from "main/pages/Hotels/HotelCreatePage";
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

describe("HotelCreatePage tests", () => {

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
                    <HotelCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const hotel = {
            id: 17,
            name: "The Ritz-Carlton",
            address: "8301 Hollister Ave, Santa Barbara, CA 93117",
            description: "a luxury resort in Santa Barbara set on 78 acres with two natural beaches, a holistic spa and seasonal cuisine."
        };

        axiosMock.onPost("/api/hotels/post").reply( 202, hotel );

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HotelCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByTestId("HotelForm-name")).toBeInTheDocument();
        });

        const nameYYYYQField = getByTestId("HotelForm-name");
        const addressField = getByTestId("HotelForm-address");
        const descriptionField = getByTestId("HotelForm-description");
        const submitButton = getByTestId("HotelForm-submit");

        fireEvent.change(nameYYYYQField, { target: { value: 'The Ritz-Carlton' } });
        fireEvent.change(addressField, { target: { value: '8301 Hollister Ave, Santa Barbara, CA 93117' } });
        fireEvent.change(descriptionField, { target: { value: 'a luxury resort in Santa Barbara set on 78 acres with two natural beaches, a holistic spa and seasonal cuisine.' } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
                "name": "The Ritz-Carlton",
                "address": "8301 Hollister Ave, Santa Barbara, CA 93117",
                "description": "a luxury resort in Santa Barbara set on 78 acres with two natural beaches, a holistic spa and seasonal cuisine."
        });

        expect(mockToast).toBeCalledWith("New hotel Created - id: 17 name: The Ritz-Carlton");
        expect(mockNavigate).toBeCalledWith({ "to": "/hotels/" });
    });


});


