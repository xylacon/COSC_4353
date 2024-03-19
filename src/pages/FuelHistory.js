import React from 'react'
import '../css/FuelHistory.css'

function FuelHistory() {
  const prepopulatedHistory = [
    {
      date: "2021-01-01",
      gallons: 100,
      price: 260
    },
    {
      date: "2022-11-18",
      gallons: 100,
      price: 255
    },
    {
      date: "2023-04-20",
      gallons: 69,
      price: 420
    }
  ]

  return (
    <main className='FuelHistory'>
      <h1>Fuel History</h1>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Gallons</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {prepopulatedHistory.map((entry, index) => (
            <tr key={index}>
              <td>{entry.date}</td>
              <td>{entry.gallons}</td>
              <td>{entry.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}

export default FuelHistory