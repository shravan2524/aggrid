import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="position-absolute h-100 w-100 d-flex justify-content-center align-items-center">
      <div className="d-flex justify-content-center align-items-center flex-column">
        <h1>
          <strong className="text-danger">
            <i className="fa-solid fa-circle-info" />
            {' '}
            Error 404
          </strong>
        </h1>
        <h3>Page not found</h3>
        <p>
          <NavLink to="/" className="btn btn-outline-dark">
            <i className="fa-solid fa-arrow-left-long" />
            {' '}
            Back to home page
          </NavLink>
        </p>
      </div>
    </div>
  );
}
