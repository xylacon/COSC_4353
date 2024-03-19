import React from "react"
import { useState, useEffect } from "react"
import Menu from "./Menu"

import "../css/Header.css"

const Header = () => {
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
				<Menu />
			</div>
		</header>
	)
}

export default Header