import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/hotelUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function HotelTable({ hotels, currentUser }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/hotels/edit/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/hotels/all"]
    );
    // Stryker enable all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }


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
            Header: 'Address',
            accessor: 'address',
        },
        {
            Header: 'Description',
            accessor: 'description',
        }
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, "HotelTable"));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, "HotelTable"));
    } 

    // Stryker disable next-line ArrayDeclaration : [columns] is a performance optimization
    const memoizedColumns = React.useMemo(() => columns, [columns]);
    const memoizedHotels = React.useMemo(() => hotels, [hotels]);

    return <OurTable
        data={memoizedHotels}
        columns={memoizedColumns}
        testid={"HotelTable"}
    />;
};