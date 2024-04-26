import axios from "axios";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

function Login() {
  //hooks
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookie] = useCookies();
  const navigate = useNavigate();

  //handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      console.log(response.data);

      // Create login cookie
      setCookie('isLoggedIn', 1)
      navigate("/client-profile");
    } catch (error) {
      console.error("FAILED", error);
    }
  };

  return (
    <main className="Login">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
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
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            required
          />
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
