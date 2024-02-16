import './css/App.css'
import { Routes, Route } from 'react-router-dom'
import {
  Login,
  FuelQuote,
  ClientProfile,
  ClientRegistration
} from './pages'
import Menu from './components/Menu'

function App() {
  return (
    <div className="App">
      <h1>COSC 4353 App</h1>
      <Menu />
      <Routes>
        <Route path="/fuel-quote" element={<FuelQuote />} />
        <Route path="/client-profile" element={<ClientProfile />} />
        <Route path="/client-registration" element={<ClientRegistration />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App