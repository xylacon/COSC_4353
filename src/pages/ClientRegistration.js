import React, { useState } from "react"

function ClientRegistration() {
  //hooks
  const [email, setEmail] = useState("")
  const [password, setPass] = useState("")

  //handler
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Signing up with:", { email, password })
  }

  return (
    <main className="ClientRegistration">
      <form onSubmit={handleSubmit}>
        <h2>Client Registration</h2>
        <div>
          <label>Email: </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="youremail@email.com"
            required
          ></input>
          <br />
          <label>Password: </label>
          <input
            value={password}
            onChange={(e) => setPass(e.target.value)}
            type="password"
            placeholder="********"
            required
          ></input>
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </main>
  )
}

export default ClientRegistration
