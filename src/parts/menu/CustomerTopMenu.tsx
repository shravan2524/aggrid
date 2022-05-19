import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../logo-white.svg';

export function CustomerTopMenu() {
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
              <NavLink to="/customer/dashboard" className="nav-link">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/customer/reconciliation" className="nav-link">
                Reconciliation
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/customer/admin" className="nav-link">
                Admin
              </NavLink>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto mb-2 mb-md-0">

            {/*   <li className="d-flex justify-content-between align-items-center m-1">
              <NavLink to="/customer/notifications" className="p-1 m-0 btn btn-primary bg-color-purple-dark border-4 border-white position-relative rounded-pill ">
                <i className="fa-solid fa-bell m-1" />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  3
                  <span className="visually-hidden">unread messages</span>
                </span>
              </NavLink>
            </li>
*/}
            <li className="nav-item">
              <NavLink to="/customer/notifications" className="nav-link">
                Notifications
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/customer/profile" className="nav-link">
                Profile
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/auth/logout" className="nav-link">
                Logout
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
