import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

function Menu() {
  const [checkBox, setCheckBox] = useState(false);
  const [cookies, setCookie] = useCookies();
  const navigate = useNavigate();

  useEffect(() => {
    function changeSize() {
      // Dynamically change menu size to window size
      const vw = window.innerWidth;
      document.documentElement.style.setProperty(
        "--hamburger-width",
        `${vw}px`
      );
    }

    changeSize();

    window.addEventListener("resize", changeSize);
    return () => window.removeEventListener("resize", changeSize);
  }, []);

  function handleChange(event) {
    const { checked } = event.target;
    setCheckBox(checked);
  }

  function lockScroll() {
    // Prevent scrolling when menu is open
    const body = document.body.style;
    checkBox ? (body.overflow = "hidden") : (body.overflow = "auto");
  }

  function handleClick() {
    setCheckBox(false);
    document.documentElement.scrollTop = 0; // Scroll page to top when going to new page
  }

  async function logOut() {
    try {
      await axios.post("http://localhost:3000/logout"); // Make a POST request to the backend logout endpoint
      setCookie("isLoggedIn", 0); // Remove the 'isLoggedIn' cookie
      navigate("/"); // Redirect to the home page after successful logout
    } catch (error) {
      console.error("Error logging out:", error);
      // Handle the error, such as showing an error message to the user
    }
  }

  lockScroll();

  return (
    <div className="menu">
      <input
        type="checkbox"
        id="menu-toggle"
        checked={checkBox}
        onChange={handleChange}
      />
      <label className="menu-button-container" htmlFor="menu-toggle">
        <div className="menu-button-top"></div>
        <div className="menu-button-middle"></div>
        <div className="menu-button-bottom"></div>
      </label>
      <ul className="menu-items">
        {cookies.isLoggedIn ? (
          <ul className="menu-items">
            <li onClick={handleClick}>
              <NavLink to="/client-profile">Client Profile</NavLink>
            </li>
            <li onClick={handleClick}>
              <NavLink to="/fuel-quote">Fuel Quote</NavLink>
            </li>
            <li onClick={handleClick}>
              <NavLink to="/fuel-history">Fuel History</NavLink>
            </li>
            <li onClick={logOut}>Log out</li>
          </ul>
        ) : (
          <ul className="menu-items">
            <li onClick={handleClick}>
              <NavLink to="/login">Login</NavLink>
            </li>
          </ul>
        )}
      </ul>
    </div>
  );
}

export default Menu;
