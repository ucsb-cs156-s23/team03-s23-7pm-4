import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";
import AppNavbarLocalhost from "main/components/Nav/AppNavbarLocalhost"

export default function AppNavbar({ currentUser, systemInfo, doLogout, currentUrl = window.location.href }) {
  return (
    <>
      {
        (currentUrl.startsWith("http://localhost:3000") ||
          currentUrl.startsWith("http://127.0.0.1:3000")) && (
          <AppNavbarLocalhost url={currentUrl} />
        )
      }
      <Navbar expand="xl" variant="dark" bg="dark" sticky="top" data-testid="AppNavbar">
        <Container>
          <Navbar.Brand as={Link} to="/">
            Example
          </Navbar.Brand>

          <Navbar.Toggle />

          <Nav className="me-auto">
            {
              systemInfo?.springH2ConsoleEnabled && (
                <>
                  <Nav.Link href="/h2-console">H2Console</Nav.Link>
                </>
              )
            }
            {
              systemInfo?.showSwaggerUILink && (
                <>
                  <Nav.Link href="/swagger-ui/index.html">Swagger</Nav.Link>
                </>
              )
            }
          </Nav>

          <>
            {/* be sure that each NavDropdown has a unique id and data-testid  */}
          </>

          <Navbar.Collapse className="justify-content-between">
            <Nav className="mr-auto">
              {
                hasRole(currentUser, "ROLE_ADMIN") && (
                  <NavDropdown title="Admin" id="appnavbar-admin-dropdown" data-testid="appnavbar-admin-dropdown" >
                    <NavDropdown.Item href="/admin/users">Users</NavDropdown.Item>
                  </NavDropdown>
                )
              }
            </Nav>

            <Nav className="mr-auto">
              {
                hasRole(currentUser, "ROLE_USER") && (
                  <NavDropdown title="Todos" id="appnavbar-todos-dropdown" data-testid="appnavbar-todos-dropdown" >
                    <NavDropdown.Item href="/todos/list">List Todos</NavDropdown.Item>
                    <NavDropdown.Item href="/todos/create">Create Todo</NavDropdown.Item>
                  </NavDropdown>
                )
              }
            </Nav>

            <Nav className="mr-auto">
              {
                hasRole(currentUser, "ROLE_USER") && (
                  <NavDropdown title="UCSBDates" id="appnavbar-ucsbdates-dropdown" data-testid="appnavbar-ucsbdates-dropdown" >
                    <NavDropdown.Item href="/ucsbdates/list" data-testid="appnavbar-ucsbdates-list">List</NavDropdown.Item>
                    {
                      hasRole(currentUser, "ROLE_ADMIN") && (
                        <NavDropdown.Item href="/ucsbdates/create" data-testid="appnavbar-ucsbdates-create">Create</NavDropdown.Item>
                      )
                    }
                  </NavDropdown>
                )
              }
            </Nav>
            <Nav className="mr-auto">
              {
                hasRole(currentUser, "ROLE_USER") && (
                  <NavDropdown title="Hotels" id="appnavbar-hotels-dropdown" data-testid="appnavbar-hotels-dropdown" >
                    <NavDropdown.Item href="/hotels/list" data-testid="appnavbar-hotels-list">List</NavDropdown.Item>
                    {
                      hasRole(currentUser, "ROLE_ADMIN") && (
                        <NavDropdown.Item href="/hotels/create" data-testid="appnavbar-hotels-create">Create</NavDropdown.Item>
                      )
                    }
                  </NavDropdown>
                )
              }
            </Nav>

            <Nav className="mr-auto">
              {
                hasRole(currentUser, "ROLE_USER") && (
                  <NavDropdown title="Restaurants" id="appnavbar-restaurants-dropdown" data-testid="appnavbar-restaurants-dropdown" >
                    <NavDropdown.Item href="/restaurants/list" data-testid="appnavbar-restaurants-list">List</NavDropdown.Item>
                    {
                      hasRole(currentUser, "ROLE_ADMIN") && (
                        <NavDropdown.Item href="/restaurants/create" data-testid="appnavbar-restaurants-create">Create</NavDropdown.Item>
                      )
                    }
                  </NavDropdown>
                )
              }
            </Nav>

            <Nav className="mr-auto">
              {
                hasRole(currentUser, "ROLE_USER") && (
                  <NavDropdown title="Movies" id="appnavbar-movies-dropdown" data-testid="appnavbar-movies-dropdown" >
                    <NavDropdown.Item href="/movies/list" data-testid="appnavbar-movies-list">List</NavDropdown.Item>
                    {
                      hasRole(currentUser, "ROLE_ADMIN") && (
                        <NavDropdown.Item href="/movies/create" data-testid="appnavbar-movies-create">Create</NavDropdown.Item>
                      )
                    }
                  </NavDropdown>
                )
              }
            </Nav>

            <Nav className="ml-auto">
              {
                currentUser && currentUser.loggedIn ? (
                  <>
                    <Navbar.Text className="me-3" as={Link} to="/profile">Welcome, {currentUser.root.user.email}</Navbar.Text>
                    <Button onClick={doLogout}>Log Out</Button>
                  </>
                ) : (
                  <Button href="/oauth2/authorization/google">Log In</Button>
                )
              }
            </Nav>
          </Navbar.Collapse>
        </Container >
      </Navbar >
    </>
  );
}