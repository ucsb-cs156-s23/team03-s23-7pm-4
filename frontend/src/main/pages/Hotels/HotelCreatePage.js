import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import HotelForm from "main/components/Hotels/HotelForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function HotelsCreatePage() {

  const objectToAxiosParams = (hotel) => ({
    url: "/api/hotels/post",
    method: "POST",
    params: {
      name: hotel.name,
      address: hotel.address,
      description: hotel.description
    }
  });

  const onSuccess = (hotel) => {
    toast(`New hotel Created - id: ${hotel.id} name: ${hotel.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/hotels/all"]
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to="/hotels/list" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Hotel</h1>

        <HotelForm submitAction={onSubmit} />

      </div>
    </BasicLayout>
  )
}