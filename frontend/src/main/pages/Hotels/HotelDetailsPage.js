import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import HotelTable from 'main/components/Hotels/HotelTable';
import { hotelUtils } from 'main/utils/hotelUtils';
import { useCurrentUser } from 'main/utils/currentUser'
import { useBackend } from 'main/utils/useBackend';

export default function HotelDetailsPage() {
  let { id } = useParams();
  const currentUser = useCurrentUser();

  const { data: hotel, error, status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/hotels?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/hotels`,
        params: {
          id
        }
      }
    );


  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Hotel Details</h1>
        {
          hotel && <HotelTable hotels={[hotel]} currentUser={currentUser} showButtons={false} />
        }
      </div>
    </BasicLayout>
  )
}