import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import HotelTable from 'main/components/Hotels/HotelTable';
import { useCurrentUser } from 'main/utils/currentUser'

export default function HotelIndexPage() {

  const currentUser = useCurrentUser();

  const { data: hotels, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/hotels/all"],
      { method: "GET", url: "/api/hotels/all" },
      []
    );

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Hotels</h1>
        <HotelTable hotels={hotels} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
}