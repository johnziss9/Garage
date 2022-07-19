import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import './CustomNavbar.css';

function CustomNavbar() {
    return (
        <label>
            <input type="checkbox" />
            <span className="menu">
                <span className="hamburger"></span>
            </span>
            <ul>
                <li>
                    <Link to="/Reminders">Reminders</Link>
                </li>
                <li>
                    <Link to="/Rentals">Rentals</Link>
                </li>
                <li>
                    <Link to="/Repairs">Repairs</Link>
                </li>
            </ul>
        </label>
    );
}

export default CustomNavbar;
