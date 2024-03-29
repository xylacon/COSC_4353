import axios from "axios";
import React, { useState } from "react";

function ClientRegistration() {
  //hooks
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");

  //handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/client-registration",
        {
          email,
          password,
        }
      );

      console.log(response.data);
    } catch (error) {
      console.error("Registration FAILED", error);
    }
  };

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
  );
}

export default ClientRegistration;
