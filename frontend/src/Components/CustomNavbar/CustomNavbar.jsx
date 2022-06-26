import React from 'react';
import { useNavigate } from "react-router-dom";
import './CustomNavbar.css';

function CustomNavbar() {
    return (
        <label>
            <input type="checkbox" />
            <span class="menu">
                <span class="hamburger"></span>
            </span>
            <ul>
                <li>
                    <a href="#">Reminders</a>
                </li>
                <li>
                    <a href="#">Rentals</a>
                </li>
                <li>
                    <a href="#">Repairs</a>
                </li>
            </ul>
        </label>
    );
}

export default CustomNavbar;
