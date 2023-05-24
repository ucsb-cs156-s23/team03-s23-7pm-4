import { fireEvent, queryByTestId, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import HotelEditPage from "main/pages/Hotels/HotelEditPage";

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

describe("HotelEditPage tests", () => {

    describe("when the backend doesn't return a todo", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/hotels", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            const {getByText, queryByTestId, findByText} = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HotelEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await findByText("Edit Hotel");
            expect(queryByTestId("HotelForm-name")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/hotels", { params: { id: 17 } }).reply(200, {
                id: 17,
                name: "Riviera Beach House",
                address: "121 State St, Santa Barbara, CA 93101",
                description: "Set in a trendy Funk Zone neighborhood, this chic adobe-style hotel with views of the Santa Ynez Mountains is a 4-minute walk from Stearns Wharf"    
            });
            axiosMock.onPut('/api/hotels').reply(200, {
                id: "17",
                name: "The Leta Hotel",
                address: "5650 Calle Real, Goleta, CA 93117",
                description: "hotel's rooms feature an eclectic mix of textures and textiles, accented by dashes of nostalgia like mid-mod furnishings."     
            });
        });

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

        test("Is populated with the data provided", async () => {

            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HotelEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("HotelForm-name");

            const idField = getByTestId("HotelForm-id");
            const nameField = getByTestId("HotelForm-name");
            const addressField = getByTestId("HotelForm-address");
            const descriptionField = getByTestId("HotelForm-description");
            const submitButton = getByTestId("HotelForm-submit");

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("Riviera Beach House");
            expect(addressField).toHaveValue("121 State St, Santa Barbara, CA 93101");
            expect(descriptionField).toHaveValue("Set in a trendy Funk Zone neighborhood, this chic adobe-style hotel with views of the Santa Ynez Mountains is a 4-minute walk from Stearns Wharf");
        });

        test("Changes when you click Update", async () => {



            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HotelEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("HotelForm-name");

            const idField = getByTestId("HotelForm-id");
            const nameField = getByTestId("HotelForm-name");
            const addressField = getByTestId("HotelForm-address");
            const descriptionField = getByTestId("HotelForm-description");
            const submitButton = getByTestId("HotelForm-submit");

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("Riviera Beach House");
            expect(addressField).toHaveValue("121 State St, Santa Barbara, CA 93101");
            expect(descriptionField).toHaveValue("Set in a trendy Funk Zone neighborhood, this chic adobe-style hotel with views of the Santa Ynez Mountains is a 4-minute walk from Stearns Wharf");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(nameField, { target: { value: 'The Leta Hotel' } })
            fireEvent.change(addressField, { target: { value: '5650 Calle Real, Goleta, CA 93117' } })
            fireEvent.change(descriptionField, { target: { value: "hotel's rooms feature an eclectic mix of textures and textiles, accented by dashes of nostalgia like mid-mod furnishings." } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled);
            expect(mockToast).toBeCalledWith("Hotel Updated - id: 17 name: The Leta Hotel");
            expect(mockNavigate).toBeCalledWith({ "to": "/hotels/list" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                name: 'The Leta Hotel',
                address: "5650 Calle Real, Goleta, CA 93117",
                description: "hotel's rooms feature an eclectic mix of textures and textiles, accented by dashes of nostalgia like mid-mod furnishings."
            })); // posted object

        });

       
    });
});


