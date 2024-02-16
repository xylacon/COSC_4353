import { NavLink } from "react-router-dom"
import React from 'react'

function Menu() {
  return (
    <div className="Menu">
      <ul className="menu-items">
        <li>
          <NavLink to="/">Login</NavLink>
        </li>
        <li>
          <NavLink to="/fuel-quote">Fuel Quote</NavLink>
        </li>
        <li>
          <NavLink to="/client-profile">Client Profile</NavLink>
        </li>
        <li>
          <NavLink to="/client-registration">Client Registration</NavLink>
        </li>
      </ul>
    </div>
  )
}

export default Menu