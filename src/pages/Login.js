import axios from "axios";
import React, { useState } from "react";
import { NavLink } from "react-router-dom"

function Login() {
  //hooks
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      console.log(response.data);
    } catch (error) {
      console.error("FAILED", error);
    }
  };

  return (
    <main className="Login">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
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
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="********"
            required
          ></input>
        </div>
        <button type="submit">Log In</button>
      </form>
      <p>
        Don't have an account? <NavLink className={"ext-link"} to="/client-registration">Register</NavLink>
      </p>
    </main>
  );
}

export default Login;
