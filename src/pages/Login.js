import React, { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  //hooks
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //handler
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ password });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div>
          <label>Email: </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="youremail@gmail.com"
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
        Don't have an account? <Link to="/client-registration">Sign Up</Link>
      </p>
    </>
  );
}

export default Login;
