import React, {useState, useEffect} from 'react'
import "../css/FuelQuote.css"
import axios from 'axios'

function FuelQuote() {
  // hooks
  const [totalPrice, setTotalPrice] = useState(0)
  const [userData, setUserData] = useState(null);
  // constants
  const suggestedPrice = 3.14
  const clientAddress = '1900 Coco Drive. Houston, TX 77882'

  useEffect(() => {
    const fetchData = async () => {
      console.log("asdfsadf trying fuel quote");
      try {
        const response = await axios.get('http://localhost:3000/fuelquote');
        console.log(response.data[0]);
        setUserData(response.data[0]);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  // event handler for form submission
  const submitFuelQuoteForm = (e) => {
    e.preventDefault();

    const sentData = {
      gallonsRequested: e.target.gallons.value,
      deliveryAddress: userData.Address1,
      deliveryDate: e.target.date.value,
      suggestedPrice: suggestedPrice,
    }

    // api request for fuel quote form
    axios.post('http://localhost:3000/fuelquote', sentData).then(response => {
      console.log(response.data);
      setTotalPrice(response.data);
    }).catch(error => {
      console.error('Error fetching data:', error);
    })
  }

  if(!userData) {
    return (<div>Loading...</div>);
  }

  return (
    <main className='FuelQuote'>
      <h1>FuelQuote</h1>
      <form onSubmit={submitFuelQuoteForm}>
        <label>Gallons Requested: </label>
        <input type="number" name="gallons" />
        <br />
        <label>Delivery Address: </label>
        <label>{userData.Address1}</label>
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