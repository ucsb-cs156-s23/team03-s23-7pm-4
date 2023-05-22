import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import RestaurantTable from 'main/components/Restaurants/RestaurantTable';
import { restaurantUtils } from 'main/utils/restaurantUtils';
import { useCurrentUser } from 'main/utils/currentUser'
import { useBackend } from 'main/utils/useBackend';

export default function RestaurantDetailsPage() {
  let { id } = useParams();
  const currentUser = useCurrentUser();

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


  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Restaurant Details</h1>
        <RestaurantTable restaurants={[restaurant || {}]} currentUser={currentUser} showButtons={false} />
      </div>
    </BasicLayout>
  )
}
