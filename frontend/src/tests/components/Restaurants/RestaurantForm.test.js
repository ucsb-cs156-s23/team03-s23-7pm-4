import { render, waitFor, fireEvent } from "@testing-library/react";
import RestaurantForm from "main/components/Restaurants/RestaurantForm";
import { restaurantFixtures } from "fixtures/restaurantFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("RestaurantForm tests", () => {

    test("renders correctly", async () => {

        const { getByText, findByText } = render(
            <Router  >
                <RestaurantForm />
            </Router>
        );
        await findByText(/Name/);
        await findByText(/Create/);
    });


    test("renders correctly when passing in a Restaurant", async () => {

        const { getByText, getByTestId, findByTestId } = render(
            <Router  >
                <RestaurantForm initialContents={restaurantFixtures.oneRestaurant} />
            </Router>
        );
        await findByTestId(/RestaurantForm-id/);
        expect(getByText(/Id/)).toBeInTheDocument();
        expect(getByTestId(/RestaurantForm-id/)).toHaveValue("1");
    });

    test("Correct Error messsages on missing input", async () => {

        const { getByTestId, getByText, findByTestId, findByText } = render(
            <Router  >
                <RestaurantForm />
            </Router>
        );
        await findByTestId("RestaurantForm-submit");
        const submitButton = getByTestId("RestaurantForm-submit");

        fireEvent.click(submitButton);

        await findByText(/Name is required./);
        expect(getByText(/Description is required./)).toBeInTheDocument();
        expect(getByText(/Price is required./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        const { getByTestId, queryByText, findByTestId } = render(
            <Router  >
                <RestaurantForm submitAction={mockSubmitAction} />
            </Router>
        );
        await findByTestId("RestaurantForm-name");

        const nameField = getByTestId("RestaurantForm-name");
        const descriptionField = getByTestId("RestaurantForm-description");
        const priceField = getByTestId("RestaurantForm-price");
        const submitButton = getByTestId("RestaurantForm-submit");

        fireEvent.change(nameField, { target: { value: 'Habit' } });
        fireEvent.change(descriptionField, { target: { value: 'Burgers and fries' } });
        fireEvent.change(priceField, { target: { value: '$' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(queryByText(/Name must be in string format/)).not.toBeInTheDocument();
        expect(queryByText(/Price must be in string format/)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        const { getByTestId, findByTestId } = render(
            <Router  >
                <RestaurantForm />
            </Router>
        );
        await findByTestId("RestaurantForm-cancel");
        const cancelButton = getByTestId("RestaurantForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


