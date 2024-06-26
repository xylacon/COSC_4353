import React, { useState, useEffect } from "react"
import axios from "axios"
import { FaCheck, FaExclamation } from 'react-icons/fa'

function ClientProfile() {
  const initialFormData = {
    name: '',
    address1: '',
    address2: '',
    city: '',
    state: 'AL',
    zip: ''
  }
  const initialMessageData = {
		class: '',
		text: ''
	}

  const [formData, setFormData] = useState(initialFormData)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(initialMessageData)

  const states = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ]
  const stateOptions = states.map(state => {
    return <option value={state}>{state}</option> // FIX ME: EACH NEEDS UNIQUE KEY
  })

  // Populate user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/client-profile');
        console.log(response.data);
        setFormData(parseData(response.data));
      }
      catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [])

  function parseData(obj) {
    const newObj = {};
    for (const key in obj) {
      if (obj[key] === null) {
        newObj[key] = '';
      }
      else {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  }

  function handleChange(event) {
    let { id, value } = event.target
    
    if (id === "name") {
      value = value.replace(/[^a-zA-Z\s]/g, '');
    }

    setFormData(oldFormData => ({
      ...oldFormData,
      [id]: value
    }))
  }

  async function submitForm(event) {
    event.preventDefault();
    setSubmitting(true)
		await postSubmission()
		setSubmitting(false)
  }

  async function postSubmission() {
    const payload = { ...formData }

    try {
      const result = await axios.post("http://localhost:3000/client-profile", payload)
      console.log(result)
      setMessage({
				class: 'success',
				text: 'Updated successfully.'
			})
    } catch (error) {
      console.error("FAILED", error)
      setMessage({
				class: 'failed',
				text: 'Updated failed. Please try again.'
			})
    }
  }

  return (
	  <main className="ClientProfile">
      <h1>Client Profile</h1>
      <form onSubmit={submitForm}>
        <div className="item">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            placeholder='Your Name'
            required
            maxLength="50"
            onChange={handleChange}
            value={formData.name}
          />
        </div>
        <div className="item">
          <label htmlFor="address1">Address 1</label>
          <input
            type="text"
            id="address1"
            placeholder='123 Place St'
            required
            maxLength="100"
            onChange={handleChange}
            value={formData.address1}
          />
        </div>
        <div className="item">
          <label htmlFor="address2">Address 2</label>
          <input
            type="text"
            id="address2"
            placeholder='Ste 123'
            maxLength="100"
            onChange={handleChange}
            value={formData.address2}
          />
        </div>
        <div className="item">
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            placeholder='Houston'
            maxLength="100"
            onChange={handleChange}
            value={formData.city}
          />
        </div>
        <div className="item">
          <label htmlFor="state">State</label>
          <select
            id="state"
            name="state"
            required
            onChange={handleChange}
            value={formData.state}
          >
            {stateOptions}
          </select>
        </div>
        <div className="item">
          <label htmlFor="zip">Zipcode</label>
          <input
            type="number"
            id="zip"
            placeholder='12345'
            minLength="5"
            maxLength="9"
            onChange={handleChange}
            value={formData.zip}
          />
        </div>
        <button disabled={submitting}>
          {submitting ? 'Updating...' : 'Update'}
        </button>
        {message.class.length > 0 &&
          <div className={`message ${message.class}`}>
            {message.class === 'failed' ? <FaExclamation /> : <FaCheck />}<div>{message.text}</div>
          </div>
        }
      </form>
    </main>
  )
}

export default ClientProfile