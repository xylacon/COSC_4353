import React from 'react'
import { useEffect } from 'react'
import { useCookies } from "react-cookie"

import { Routes, Route } from 'react-router-dom'
import {
  Login,
  ClientProfile,
  ClientRegistration,
  FuelHistory,
  FuelQuote
} from './pages'
import {
  Header,
  Footer
} from './components'
import company from "./assets/company_info.json"

import './css/App.css'

function App() {
  const [cookies, setCookie] = useCookies();

  useEffect(() => {
    function changeTheme() {
      let dark = window.matchMedia("(prefers-color-scheme: dark)").matches

      if (dark) {
        document.documentElement.setAttribute("data-theme", "dark")
        document.querySelector('meta[name="theme-color"]').setAttribute("content", "000000")
      } else {
        document.documentElement.setAttribute("data-theme", "light")
        document.querySelector('meta[name="theme-color"]').setAttribute("content", "#ffffff")
      }
    }

    document.title = company.name
    changeTheme()
    
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", changeTheme)
    return () => window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", changeTheme)
  }, [])

  return (
    <div className="App">
      <Header />
      {cookies.isLoggedIn ? (
        <Routes>
          <Route path="/client-profile" element={<ClientProfile />} />
          <Route path="/fuel-quote" element={<FuelQuote />} />
          <Route path="/fuel-history" element={<FuelHistory />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/client-registration" element={<ClientRegistration />} />
          <Route path="/" element={<Login />} />
        </Routes>
      )}
      <Footer />
    </div>
  )
}

export default App