import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <h1>Logo</h1>
      <ul className="navv">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/chatbot" className="login"><i className="fa-solid fa-right-to-bracket"></i></Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
