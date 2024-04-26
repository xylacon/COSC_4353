import { React, useState, useEffect, useLayoutEffect } from "react"
import axios from "axios";
import Menu from "./Menu"
import company from "../assets/company_info.json"
import { NavLink, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import "../css/Header.css"

const Header = () => {
	const [scrolled, setScrolled] = useState(false)
	const [cookies, setCookie] = useCookies();
  const navigate = useNavigate();

	useEffect(() => {
		function checkHeader() {
			document.documentElement.scrollTop !== 0 ? setScrolled(true) : setScrolled(false)
    }

		window.addEventListener("scroll", checkHeader)
		return () => window.removeEventListener("scroll", checkHeader)
	}, [scrolled])

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

	return (
		<header className={scrolled ? "header scroll-shadow" : "header"}>
			<div className="header-container">
				<h1><NavLink to="/">{company.name}</NavLink></h1>
				<Menu />
				{cookies.isLoggedIn === 1 && (
					<ul className="menu-items">
						<li onClick={logOut}><a>Log Out</a></li>
					</ul>
				)}
			</div>
		</header>
	)
}

export default Header