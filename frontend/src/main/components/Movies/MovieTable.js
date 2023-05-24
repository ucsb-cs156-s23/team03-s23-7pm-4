import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/movieUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function MovieTable({ movies, currentUser, showButtons = true}) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/movies/edit/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/movies/all"]
    );
    // Stryker enable all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }
    
    const detailsCallback = (cell) => {
        navigate(`/movies/details/${cell.row.values.id}`)
    }

    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'Name',
            accessor: 'name',
        },
        {
            Header: 'Year',
            accessor: 'year',
        },
        {
            Header: 'Summary',
            accessor: 'summary',
        }
    ];

    if (showButtons){
        if (hasRole(currentUser, "ROLE_ADMIN")) {
            columns.push(ButtonColumn("Edit", "primary", editCallback, "MovieTable"));
            columns.push(ButtonColumn("Delete", "danger", deleteCallback, "MovieTable"));
        } 
        columns.push(ButtonColumn("Details", "primary", detailsCallback, "MovieTable"));
    }

    // Stryker disable next-line ArrayDeclaration : [columns] is a performance optimization
    const memoizedColumns = React.useMemo(() => columns, [columns]);
    const memoizedMovies = React.useMemo(() => movies, [movies]);

    return <OurTable
        data={memoizedMovies}
        columns={memoizedColumns}
        testid={"MovieTable"}
    />;
};