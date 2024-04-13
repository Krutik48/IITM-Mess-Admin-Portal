import './App.css'
import { Navbar, NavbarBrand, Nav, Container, NavItem, NavLink  } from 'reactstrap';
import { BrowserRouter, Routes, Route, Link,Navigate  } from 'react-router-dom';
import { MessMenu } from './components/messMenu.jsx';
import { FoodItems } from './components/foodItems.jsx';
import { Mess } from './components/mess.jsx';
import { Login } from './components/login.jsx';
import { useEffect, useState } from 'react';
import logo from './assets/logo.png';


function App() {

  const [link, setLink] = useState(window.location.pathname);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // log out function
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const { pathname } = window.location;
    setLink(pathname);
  }, []);

  return (
    <>
      <BrowserRouter>
          <Navbar expand="md" className="mb-4 custom-navbar bg-dark">
            <NavbarBrand tag={Link} to="/">
              <img src={logo} alt="logo" width="50" height="50" className= "d-inline-block" />
              <h3 className="d-inline-block text-white py-0 align-text-top px-3">IITM Mess Admin Portal</h3>
            </NavbarBrand>
            {!isAuthenticated || link === '/login' ? null : ( 
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <NavLink tag={Link} to="/mess" className={link === '/mess' ? "text-white nav-link active" : "text-white nav-link"}>Mess</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/" className={link === '/' ? "text-white nav-link active" : "text-white nav-link"}>Mess Menu</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/foodItems" className={link === '/foodItems' ? "text-white nav-link active" : "text-white nav-link"}>Food Items</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink onClick={handleLogout} className="text-warning nav-link">Logout</NavLink>
                </NavItem>
              </Nav>
            )}
          </Navbar>
        <Routes>
          <Route path="/" element={<MessMenu setLink={setLink} />} />
          <Route path="/foodItems" element={<FoodItems setLink={setLink} />} />
          <Route path="/mess" element={<Mess setLink={setLink} />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          {/* Redirect to the login page if the user is not authenticated */}
        </Routes>
        {!isAuthenticated ? <Navigate to="/login" /> : null}
        {isAuthenticated && link === '/login' ? <Navigate to="/" /> : null}
      </BrowserRouter>
    </>
  )
}

export default App
