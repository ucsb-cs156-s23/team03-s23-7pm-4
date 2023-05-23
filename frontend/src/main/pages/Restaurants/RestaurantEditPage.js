
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import RestaurantForm from 'main/components/Restaurants/RestaurantForm';
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";


export default function RestaurantEditPage() {
    let { id } = useParams();
  
    const { data: restaurant, error, status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/restaurants?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/restaurants`,
        params: {
          id
        }
      }
    );

    const objectToAxiosPutParams = (restaurant) => ({
        url: "/api/restaurants",
        method: "PUT",
        params: {
          id:id
        },
        data: {
          name: restaurant.name,
          description: restaurant.description,
          price: restaurant.price
        }
      }); 

    const onSuccess = (restaurant) => {
        toast(`Restaurant Updated - id: ${restaurant.id} name: ${restaurant.name}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/restaurants?id=${id}`]
      );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }
    
    if (isSuccess) {
        return <Navigate to="/restaurants/list" />
    }
    

    return (
        <BasicLayout>
            <div className="pt-2">
              <h1>Edit Restaurant</h1>
              {restaurant &&
                <RestaurantForm initialContents={restaurant} submitAction={onSubmit} buttonLabel="Update" />
              }
        </div>
        </BasicLayout>
    )
}