import React from "react"
import { useState, useEffect } from "react"
import Menu from "./Menu"
import company from "../assets/company_info.json"

import "../css/Header.css"

const Header = ({ isLoggedIn }) => {
	const [scrolled, setScrolled] = useState(false)

	useEffect(() => {
		function checkHeader() {
			document.documentElement.scrollTop !== 0 ? setScrolled(true) : setScrolled(false)
    }

		window.addEventListener("scroll", checkHeader)
		return () => window.removeEventListener("scroll", checkHeader)
	}, [scrolled])

	return (
		<header className={scrolled ? "header scroll-shadow" : "header"}>
			<div className="header-container">
				<Menu isLoggedIn={isLoggedIn} />
				<h1>{company.name}</h1>
			</div>
		</header>
	)
}

export default Header