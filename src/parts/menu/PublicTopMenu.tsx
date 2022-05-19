import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { BACKEND_API } from 'app/config';
import logo from 'logo-white.svg';
import ShowOnAuth from 'components/ShowOnAuth';
import HideOnAuth from 'components/HideOnAuth';
import { getAuthFullNameFromLocal } from '../../services/authService';
import { UserFullNameMenuItem } from './UserFullNameMenuItem';

export function PublicTopMenu() {
  const userFullName = useMemo(() => getAuthFullNameFromLocal(), []);

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

          <ShowOnAuth>
            <ul className="navbar-nav ms-auto mb-2 mb-md-0">

              <li className="nav-item dropdown">
                <UserFullNameMenuItem />
                <ul className="dropdown-menu" aria-labelledby="dropdown05">
                  <li>
                    <NavLink to="/customer/dashboard" className="dropdown-item">
                      <i className="fa-solid fa-gauge" />
                      {' '}
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <NavLink to="/auth/logout" className="dropdown-item">
                      <i className="fa-solid fa-right-from-bracket" />
                      {' '}
                      Logout
                    </NavLink>
                  </li>
                </ul>
              </li>

            </ul>
          </ShowOnAuth>

          <HideOnAuth>
            <div className="text-end ms-auto mb-2 mb-md-0">
              <a href={`${BACKEND_API}/api/v1/login`} role="button" className="btn btn-warning me-2">
                <i className="fa-solid fa-right-to-bracket" />
                {' '}
                Login
              </a>
            </div>
          </HideOnAuth>

        </div>
      </div>
    </nav>
  );
}
