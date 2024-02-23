import './css/App.css'
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import {
  Login,
  FuelQuote,
  ClientProfile,
  ClientRegistration,
  FuelHistory,
} from './pages'
import Menu from './components/Menu'

function App() {
  return (
    <div className="App">
      <h1>Fuel Quote App</h1>
      <Menu />
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