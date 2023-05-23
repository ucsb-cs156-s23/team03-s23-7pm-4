import React from 'react'
import { useBackend } from 'main/utils/useBackend';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import HotelTable from 'main/components/Hotels/HotelTable';
import { useCurrentUser } from 'main/utils/currentUser'

export default function HotelIndexPage() {

  const currentUser = useCurrentUser();

  const { data: hotels, error: _error, status: _status } =
    useBackend(
      ["/api/hotels/all"],
      { method: "GET", url: "/api/hotels/all" },
      []
    );

  return (
    <BasicLayout>
      <div className="pt-2">
      <Button style={{ float: "right" }} as={Link} to="/hotels/create">
          Create Hotel
        </Button>
        <h1>Hotels</h1>
        <HotelTable hotels={hotels} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
}