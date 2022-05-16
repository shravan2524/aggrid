import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import { BACKEND_API } from 'app/config';
import logo from '../../logo-white.svg';

export function PublicTopMenu() {
  // TODO: Remove this code is just for testing purpose
  /*
  useEffect(() => {
    fetch(`${BACKEND_API}/v1/api/me`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => console.log(data));

  }, []); */

  return (
    <nav className="navbar navbar-expand-md fixed-top navbar-dark bg-color-purple-dark">
      <div className="container">
        <NavLink to="/" className="navbar-brand">
          <img src={logo} alt="Finkraft" width={90} />
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label=""
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink to="/" className="nav-link">
                Home
              </NavLink>
            </li>

          </ul>

          <ul className="navbar-nav ms-auto mb-2 mb-md-0">
            <li className="nav-item">
              <NavLink to="/customer/dashboard" className="nav-link">
                Login
              </NavLink>
            </li>

            {/*        <li className="nav-item">
              <NavLink to="/customer/dashboard" className="nav-link">
                Dashboard
              </NavLink>
            </li> */}

          </ul>
        </div>
      </div>
    </nav>
  );
}
