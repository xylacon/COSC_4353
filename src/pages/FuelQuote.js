import React, {useState} from 'react'
import "../css/FuelQuote.css"
import axios from 'axios'

function FuelQuote() {
  // hooks
  const [totalPrice, setTotalPrice] = useState(0)
  // constants
  const suggestedPrice = 3.14
  const clientAddress = '1900 Coco Drive. Houston, TX 77882'

  // event handler for form submission
  const submitFuelQuoteForm = (e) => {
    e.preventDefault();

    const userData = {
      gallonsRequested: e.target.gallons.value,
      deliveryAddress: "asdf",
      deliveryDate: "12/2/22",
      suggestedPrice: suggestedPrice,
    }

    // api request for fuel quote form
    axios.post('http://localhost:3000/fuelquote', userData).then(response => {
      console.log(response.data);
      setTotalPrice(response.data);
    }).catch(error => {
      console.error('Error fetching data:', error);
    })
  }

  return (
    <main className='FuelQuote'>
      <h1>FuelQuote</h1>
      <form onSubmit={submitFuelQuoteForm}>
        <label>Gallons Requested: </label>
        <input type="number" name="gallons" />
        <br />
        <label>Delivery Address: </label>
        <label>{clientAddress}</label>
        <br />
        <label>Delivery Date: </label>
        <input type="date" name="date"/>
        <br />
        <label>Suggested Price: </label>
        <label>${suggestedPrice} per gallon</label>
        <br />
        <button type="submit">Submit</button>
      </form>
      <h4>Total price: {(totalPrice === 0) ? "N/A" : `$${totalPrice}`}</h4>
    </main>
  )
}

export default FuelQuote