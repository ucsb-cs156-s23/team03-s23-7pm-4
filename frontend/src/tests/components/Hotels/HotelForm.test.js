import { render, waitFor, fireEvent } from "@testing-library/react";
import HotelForm from "main/components/Hotels/HotelForm";
import { hotelFixtures } from "fixtures/hotelFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("HotelForm tests", () => {

    test("renders correctly", async () => {

        const { getByText, findByText } = render(
            <Router  >
                <HotelForm />
            </Router>
        );
        await findByText(/Name/);
        await findByText(/Create/);
    });


    test("renders correctly when passing in a Hotel", async () => {

        const { getByText, getByTestId, findByTestId } = render(
            <Router  >
                <HotelForm initialContents={hotelFixtures.oneHotel[0]} />
            </Router>
        );
        await findByTestId(/HotelForm-id/);
        expect(getByText(/Id/)).toBeInTheDocument();
        expect(getByTestId(/HotelForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on missing input", async () => {

        const { getByTestId, getByText, findByTestId, findByText } = render(
            <Router  >
                <HotelForm />
            </Router>
        );
        await findByTestId("HotelForm-submit");
        const submitButton = getByTestId("HotelForm-submit");

        fireEvent.click(submitButton);

        await findByText(/Name is required./);
        expect(getByText(/Address is required./)).toBeInTheDocument();
        expect(getByText(/Description is required./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        const { getByTestId, queryByText, findByTestId } = render(
            <Router  >
                <HotelForm submitAction={mockSubmitAction} />
            </Router>
        );
        await findByTestId("HotelForm-name");

        const nameField = getByTestId("HotelForm-name");
        const addressField = getByTestId("HotelForm-address");
        const descriptionField = getByTestId("HotelForm-description");
        const submitButton = getByTestId("HotelForm-submit");

        fireEvent.change(nameField, { target: { value: 'The Ritz-Carlton' } });
        fireEvent.change(addressField, { target: { value: '8301 Hollister Ave, Santa Barbara, CA 93117' } });
        fireEvent.change(descriptionField, { target: { value: 'a luxury resort in Santa Barbara set on 78 acres with two natural beaches, a holistic spa and seasonal cuisine.' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(queryByText(/Name must be in the format string/)).not.toBeInTheDocument();
        expect(queryByText(/Description must be in format string/)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        const { getByTestId, findByTestId } = render(
            <Router  >
                <HotelForm />
            </Router>
        );
        await findByTestId("HotelForm-cancel");
        const cancelButton = getByTestId("HotelForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


