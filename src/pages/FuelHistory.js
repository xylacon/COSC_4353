import React, {useState, useEffect} from 'react'
import axios from 'axios';
import '../css/FuelHistory.css'

function FuelHistory() {

  const [prepopulatedHistory, setPrepopulatedHistory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/fuelhistory');
        console.log(response.data);
        setPrepopulatedHistory(response.data);
      }
      catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [])

  if(!prepopulatedHistory){
    return (<div>Loading...</div>);
  }

  return (
    <main className='FuelHistory'>
      <h1>Fuel History</h1>
      <table>
        <thead>
          <tr>
            <th>Gallons</th>
            <th>Address</th>
            <th>Date</th>
            <th>Price per gallon</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {prepopulatedHistory.map((entry, index) => (
            <tr key={index}>
              <td>{entry.GallonsRequested}</td>
              <td>{entry.Address1}</td>
              <td>{entry.DeliveryDate}</td>
              <td>{entry.SuggestedPrice}</td>
              <td>{(entry.SuggestedPrice * entry.GallonsRequested)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}

export default FuelHistory