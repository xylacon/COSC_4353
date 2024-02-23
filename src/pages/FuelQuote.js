import React, {useState} from 'react'
import "../css/FuelQuote.css"

function FuelQuote() {
  // hooks
  const [totalPrice, setTotalPrice] = useState(0)
  // constants
  const suggestedPrice = 3.14
  const clientAddress = '1900 Coco Drive. Houston, TX 77882'

  // event handler for form submission
  const submitFuelQuoteForm = (e) => {
    e.preventDefault();
    const newQuotePrice = (e.target.elements.gallons.value * suggestedPrice).toFixed(2);
    setTotalPrice(newQuotePrice);
  }

  return (
    <>
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
    </>
  )
}

export default FuelQuote