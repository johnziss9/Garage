import React from 'react';
import { Link } from 'react-router-dom';
import './CustomNavbar.css';

function CustomNavbar2() {
    return (
        <nav role='navigation'>
            <div id="menuToggle">
                <input type="checkbox" />
                <span></span>
                <span></span>
                <span></span>
                <ul id="menu">
                    <li className='nav-link-list-item'><Link className='nav-link' to="/Reminders">Reminders</Link></li>
                    <li className='nav-link-list-item'><Link className='nav-link' to="/Rentals">Rentals</Link></li>
                    <li className='nav-link-list-item'><Link className='nav-link' to="/Repairs">Repairs</Link></li>
                </ul>
            </div>
        </nav>
    );
}

export default CustomNavbar2;
