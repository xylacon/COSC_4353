import React from 'react'
import { useEffect } from 'react'

import { Routes, Route } from 'react-router-dom'
import {
  Login,
  FuelQuote,
  ClientProfile,
  ClientRegistration,
  FuelHistory,
} from './pages'
import {
  Header
} from './components'

import './css/App.css'

function App() {
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

    changeTheme()
    
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", changeTheme)
    return () => window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", changeTheme)
  }, [])

  return (
    <div className="App">
      <h1>COSC 4353 App</h1>
      <Header />
      <Routes>
        <Route path="/fuel-quote" element={<FuelQuote />} />
        <Route path="/client-profile" element={<ClientProfile />} />
        <Route path="/client-registration" element={<ClientRegistration />} />
        <Route path="/" element={<Login />} />
        <Route path="/fuel-history" element={<FuelHistory />} />
      </Routes>
    </div>
  )
}

export default App