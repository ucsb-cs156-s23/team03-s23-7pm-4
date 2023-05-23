import { render, waitFor, fireEvent } from "@testing-library/react";
import MovieForm from "main/components/Movies/MovieForm";
import { movieFixtures } from "fixtures/movieFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("MovieForm tests", () => {

    test("renders correctly", async () => {

        const { getByText, findByText } = render(
            <Router  >
                <MovieForm />
            </Router>
        );
        await findByText(/Name/);
        await findByText(/Create/);
    });


    test("renders correctly when passing in a Movie", async () => {

        const { getByText, getByTestId, findByTestId } = render(
            <Router  >
                <MovieForm initialContents={movieFixtures.oneMovie[0]} />
            </Router>
        );
        await findByTestId(/MovieForm-id/);
        expect(getByText(/Id/)).toBeInTheDocument();
        expect(getByTestId(/MovieForm-id/)).toHaveValue("1");
    });



    test("Correct Error messsages on missing input", async () => {

        const { getByTestId, getByText, findByTestId, findByText } = render(
            <Router  >
                <MovieForm />
            </Router>
        );
        await findByTestId("MovieForm-submit");
        const submitButton = getByTestId("MovieForm-submit");

        fireEvent.click(submitButton);

        await findByText(/Name is required./);
        expect(getByText(/Year is required./)).toBeInTheDocument();
        expect(getByText(/Summary is required./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        const { getByTestId, queryByText, findByTestId } = render(
            <Router  >
                <MovieForm submitAction={mockSubmitAction} />
            </Router>
        );
        await findByTestId("MovieForm-name");

        const nameField = getByTestId("MovieForm-name");
        const yearField = getByTestId("MovieForm-year");
        const summaryField = getByTestId("MovieForm-summary");
        const submitButton = getByTestId("MovieForm-submit");

        fireEvent.change(nameField, { target: { value: 'Spider-Man' } });
        fireEvent.change(yearField, { target: { value: '2002' } });
        fireEvent.change(summaryField, { target: { value: 'Peter Parker gets bitten by a spider' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        const { getByTestId, findByTestId } = render(
            <Router  >
                <MovieForm />
            </Router>
        );
        await findByTestId("MovieForm-cancel");
        const cancelButton = getByTestId("MovieForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


