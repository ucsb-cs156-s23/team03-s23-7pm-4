import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useNavigate } from "react-router-dom";
import { restaurantUtils } from "main/utils/restaurantUtils";


export default function RestaurantTable({ restaurants, currentUser }) {
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
            Header: 'Description',
            accessor: 'description',
        },
        {
            Header: 'Address',
            accessor: 'address',
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
