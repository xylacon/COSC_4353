import React, { useState } from "react";

function ClientRegistration() {
  //hooks
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");

  //handler
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signing up with:", { email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
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
          onChange={(e) => setPass(e.target.value)}
          type="password"
          placeholder="********"
          required
        ></input>
      </div>
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default ClientRegistration;
