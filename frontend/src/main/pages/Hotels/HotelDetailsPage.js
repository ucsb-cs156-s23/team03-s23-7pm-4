import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import HotelTable from "main/components/Hotels/HotelTable";
import { useBackend } from "main/utils/useBackend";

import { useCurrentUser } from 'main/utils/currentUser'

export default function HotelDetailsPage() {
  let { id } = useParams();

  const currentUser = useCurrentUser();

  const { data: hotel, _error, _status } =
    useBackend(
      [`/api/hotels?id=${id}`],
      {  
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