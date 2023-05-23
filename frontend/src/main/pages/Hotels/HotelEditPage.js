import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import HotelForm from "main/components/Hotels/HotelForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";

import { toast } from "react-toastify";

export default function HotelEditPage() {
  let { id } = useParams();

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


  const objectToAxiosPutParams = (hotel) => ({
    url: "/api/hotels",
    method: "PUT",
    params: {
      id: hotel.id,
    },
    data: {
      name: hotel.name,
      address: hotel.address,
      description: hotel.description
    }
  });

  const onSuccess = (hotel) => {
    toast(`Hotel Updated - id: ${hotel.id} name: ${hotel.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    [`/api/hotels?id=${id}`]
  );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to="/hotels/" />
  }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit Hotel</h1>
                {hotel &&
                <HotelForm initialContents={hotel} submitAction={onSubmit} buttonLabel="Update" />
                }
            </div>
        </BasicLayout>
    )
}