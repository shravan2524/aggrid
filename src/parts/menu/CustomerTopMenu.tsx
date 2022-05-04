import React from 'react';
import { NavLink } from 'react-router-dom';

export function CustomerTopMenu() {
  return (
    <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <div className="container">
        <NavLink to="/" className="navbar-brand">Finkraft</NavLink>
        <button
          className="navbar-toggler collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#customerTopNavbarCollapse"
          aria-controls="customerTopNavbarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="navbar-collapse collapse" id="customerTopNavbarCollapse">
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
          </ul>
        </div>
      </div>
    </nav>
  );
}
