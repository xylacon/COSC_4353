import React, {useState, useEffect, useRef} from 'react'
import "../css/FuelQuote.css"
import axios from 'axios'

function FuelQuote() {
  // hooks
  const [totalPrice, setTotalPrice] = useState(0)
  const [userData, setUserData] = useState(null);
  const [suggestedPrice, setSuggestedPrice] = useState(null);
  const [getQuoteBtn, setGetQuoteBtn] = useState(true);
  const formRef = useRef(null);
  const [minDate, setMinDate] = useState('');

  // constants
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/fuelquote');
        setUserData(response.data[0]);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    const today = new Date();
    const formattedDate = today.toISOString().substring(0, 10);
    setMinDate(formattedDate);

    fetchData();
  }, []);

  // event handler for allowing the get quote button to appear
  const enableGetQuote = () => {
    // Set disabled to false which is the same as enabling the get quote button
    if (formRef.current.elements.gallons.value !== '' && formRef.current.elements.date.value !== ''){
      setGetQuoteBtn(false);
    }
    else {
      setGetQuoteBtn(true);
    }
  }

  // event handler for get quote button
  const getQuote = () => {
    const sentData = {
      gallonsRequested: formRef.current.elements.gallons.value,
      state: userData.State,
    }

    axios.post('http://localhost:3000/fuelquote/getquote', sentData)
    .then((res) => {
      setSuggestedPrice(`${res.data.clientSuggestedPrice}`);
      setTotalPrice(res.data.clientTotalPrice);
    })
    .catch((err) => {
      console.error('Error fetching data', err);
    })
  }

  // event handler for form submission
  const submitFuelQuoteForm = (e) => {
    e.preventDefault();

    const sentData = {
      gallonsRequested: formRef.current.elements.gallons.value,
      deliveryAddress: userData.Address1,
      state: userData.State,
      deliveryDate: formRef.current.elements.date.value,
    }

    // api request for fuel quote form
    axios.post('http://localhost:3000/fuelquote', sentData).then(response => {
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
      <form ref={formRef} onSubmit={submitFuelQuoteForm}>
        <label>Gallons Requested: </label>
        <input type="number" name="gallons" min="0" onChange={enableGetQuote}/>
        <br />
        <label>Delivery Address: </label>
        <label>{userData.Address1}</label>
        <br />
        <label>Delivery Date: </label>
        <input type="date" name="date" min={minDate} onChange={enableGetQuote}/>
        <br />
        <label>Suggested Price: </label>
        <label>{(suggestedPrice === null) ? "" : `$${suggestedPrice} per gallon`}</label>
        <br />
        <button type="button" onClick={getQuote} disabled={getQuoteBtn}>Get Quote</button>
        <button type="submit" disabled={getQuoteBtn}>Submit</button>
      </form>
      <h4>Total price: {(totalPrice === 0) ? "" : `$${totalPrice}`}</h4>
    </main>
  )
}

export default FuelQuote