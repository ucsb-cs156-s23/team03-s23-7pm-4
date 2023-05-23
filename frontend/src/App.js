import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "main/pages/HomePage";
import ProfilePage from "main/pages/ProfilePage";
import AdminUsersPage from "main/pages/AdminUsersPage";

import TodosIndexPage from "main/pages/Todos/TodosIndexPage";
import TodosCreatePage from "main/pages/Todos/TodosCreatePage";
import TodosEditPage from "main/pages/Todos/TodosEditPage";

import UCSBDatesIndexPage from "main/pages/UCSBDates/UCSBDatesIndexPage";
import UCSBDatesCreatePage from "main/pages/UCSBDates/UCSBDatesCreatePage";
import UCSBDatesEditPage from "main/pages/UCSBDates/UCSBDatesEditPage";

import MovieIndexPage from "main/pages/Movies/MovieIndexPage";
import MovieDetailsPage from "main/pages/Movies/MovieDetailsPage";
import MovieCreatePage from "main/pages/Movies/MovieCreatePage";
import MovieEditPage from "main/pages/Movies/MovieEditPage";


import HotelCreatePage from "main/pages/Hotels/HotelCreatePage";
import HotelEditPage from "main/pages/Hotels/HotelEditPage";
import HotelIndexPage from "main/pages/Hotels/HotelIndexPage";
import HotelDetailsPage from "main/pages/Hotels/HotelDetailsPage";


import RestaurantIndexPage from "main/pages/Restaurants/RestaurantIndexPage";
import RestaurantDetailsPage from "main/pages/Restaurants/RestaurantDetailsPage";
import RestaurantCreatePage from "main/pages/Restaurants/RestaurantCreatePage";
import RestaurantEditPage from "main/pages/Restaurants/RestaurantEditPage";


import { hasRole, useCurrentUser } from "main/utils/currentUser";

import "bootstrap/dist/css/bootstrap.css";


function App() {

  const { data: currentUser } = useCurrentUser();

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/profile" element={<ProfilePage />} />
        {
          hasRole(currentUser, "ROLE_ADMIN") && <Route exact path="/admin/users" element={<AdminUsersPage />} />
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/todos/list" element={<TodosIndexPage />} />
              <Route exact path="/todos/create" element={<TodosCreatePage />} />
              <Route exact path="/todos/edit/:todoId" element={<TodosEditPage />} />

              <Route exact path="/ucsbdates/list" element={<UCSBDatesIndexPage />} />

              <Route exact path="/hotels/list" element={<HotelIndexPage />} />
              <Route exact path="/hotels/details/:id" element={<HotelDetailsPage />} />

              <Route exact path="/restaurants/details/:id" element={<RestaurantDetailsPage />} />
              <Route exact path="/restaurants/list" element={<RestaurantIndexPage />} /> 

              <Route exact path="/movies/details/:id" element={<MovieDetailsPage />} />
              <Route exact path="/movies/list" element={<MovieIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/ucsbdates/edit/:id" element={<UCSBDatesEditPage />} />
              <Route exact path="/ucsbdates/create" element={<UCSBDatesCreatePage />} />

              <Route exact path="/hotels/create" element={<HotelCreatePage />} />
              <Route exact path="/hotels/edit/:id" element={<HotelEditPage />} />

              <Route exact path="/restaurants/create" element={<RestaurantCreatePage />} />
              <Route exact path="/restaurants/edit/:id" element={<RestaurantEditPage />} />

              <Route exact path="/movies/create" element={<MovieCreatePage />} />
              <Route exact path="/movies/edit/:id" element={<MovieEditPage />} />
            </>
          )
        }

      </Routes>
    </BrowserRouter>
  );
}

export default App;
