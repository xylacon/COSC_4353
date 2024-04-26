import axios from "axios";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

function ClientRegistration() {
  //hooks
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const navigate = useNavigate();

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
      navigate("/");
    } catch (error) {
      console.error("Registration FAILED", error);
    }
  };

  return (
    <main className="ClientRegistration">
      <form onSubmit={handleSubmit}>
        <h2>Client Registration</h2>
        <div className="item">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            required
          />
        </div>
        <div className="item">
          <input
            value={password}
            onChange={(e) => setPass(e.target.value)}
            type="password"
            placeholder="Password"
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </main>
  );
}

export default ClientRegistration;
