import React from 'react';
import { NavLink } from 'react-router-dom';
import { BACKEND_API } from 'app/config';
import logo from 'logo-white.svg';
import ShowOnAuth from 'components/ShowOnAuth';
import HideOnAuth from 'components/HideOnAuth';

export function PublicTopMenu() {
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

            <ShowOnAuth>
              <li className="nav-item">
                <NavLink to="/customer/dashboard" className="nav-link">
                  Dashboard
                </NavLink>
              </li>
            </ShowOnAuth>

            <HideOnAuth>
              <li className="nav-item">
                <a href={`${BACKEND_API}/api/v1/login`} className="nav-link">
                  Login
                </a>
              </li>
            </HideOnAuth>

            <ShowOnAuth>
              <li className="nav-item">
                <NavLink to="/auth/logout" className="nav-link">
                  Logout
                </NavLink>
              </li>
            </ShowOnAuth>

          </ul>
        </div>
      </div>
    </nav>
  );
}
