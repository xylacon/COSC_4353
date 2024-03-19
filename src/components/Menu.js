import React from "react"
import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"

function Menu() {
  const [checkBox, setCheckBox] = useState(false)

	useEffect(() => {
		function changeSize() { // Dynamically change menu size to window size
			const vw = window.innerWidth
			document.documentElement.style.setProperty("--hamburger-width", `${vw}px`)
		}

		changeSize()

		window.addEventListener("resize", changeSize)
		return () => window.removeEventListener("resize", changeSize)
	}, [])

	function handleChange(event) {
		const {checked} = event.target
		setCheckBox(checked)
	}

	function lockScroll() { // Prevent scrolling when menu is open
		const body = document.body.style
		checkBox ? body.overflow = "hidden" : body.overflow = "auto"
	}

	function handleClick() {
		setCheckBox(false)
		document.documentElement.scrollTop = 0 // Scroll page to top when going to new page
	}

  lockScroll()

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
        <li onClick={handleClick}>
          <NavLink to="/">Login</NavLink>
        </li>
        <li onClick={handleClick}>
          <NavLink to="/fuel-quote">Fuel Quote</NavLink>
        </li>
        <li onClick={handleClick}>
          <NavLink to="/fuel-history">Fuel History</NavLink>
        </li>
        <li onClick={handleClick}>
          <NavLink to="/client-profile">Client Profile</NavLink>
        </li>
        <li onClick={handleClick}>
          <NavLink to="/client-registration">Client Registration</NavLink>
        </li>
      </ul>
    </div>
  )
}

export default Menu