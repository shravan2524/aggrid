import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logo from 'logo-white.svg';
import { selectSecondaryMenuItems } from 'state/settings/settingsSlice';

import './CustomerTopMenu.scss';
import { getAuthFullNameFromLocal } from 'services/authService';
import { useAppDispatch } from 'app/hooks';
import {
  selectSelectedCompany,
  setSelectedCompany,
} from 'state/companies/companiesSlice';

import { getSelectedTenant } from 'state/tenants/tenantsSlice';
import { LOGOUT_LINK } from 'app/config';
import CustomerTopMenuDropDown from './CustomerTopMenuDropDown';
import CustomerTopMenuSelect from './CustomerTopMenuSelect';

function SecondaryCustomerTopMenu() {
  const secondaryMenuItems = useSelector(selectSecondaryMenuItems);

  if (!secondaryMenuItems) {
    return null;
  }

  if (!secondaryMenuItems.length) {
    return null;
  }

  return (
    <div className="nav-scroller bg-color-purple-light">
      <div className="container-fluid">
        <nav className="nav nav-underline" aria-label="Secondary navigation">
          {secondaryMenuItems.map((itm, i) => (
            <NavLink key={`${itm.path}${i}`} to={itm.path} replace className="nav-link">
              {itm.icon && (<i className={itm.icon} />)}
              {' '}
              {itm.text}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}

interface CustomerTopMenuProps {
  companies: any[]
}

export default function CustomerTopMenu({ companies }:CustomerTopMenuProps) {
  const dispatch = useAppDispatch();
  const selectedWorkspace = useSelector(getSelectedTenant);

  const userFullName = useMemo(() => getAuthFullNameFromLocal(), []);

  const selectedCompany = useSelector(selectSelectedCompany);

  const profileItems = useMemo(() => [
    {
      itemTitle: selectedWorkspace?.title ?? 'UNKNOWN',
      itemPath: '#',
      icon: 'fa-solid fa-user',
    },
    {
      divider: true,
    },
    {
      itemTitle: 'Profile',
      itemPath: '/customer/profile',
      icon: 'fa-solid fa-user',
    },
    {
      itemTitle: 'Workspaces',
      itemPath: '/customer/workspaces',
      icon: 'fa-solid fa-house-laptop',
    },
    {
      divider: false,
    },
    {
      itemTitle: 'Logout',
      itemPath: LOGOUT_LINK,
      itemExternal: true,
      icon: 'fa-solid fa-right-from-bracket',
    },
  ], [selectedWorkspace]);

  const setSelectedCompanyOption = (e) => {
    const companyId = e.value;
    if (companies) {
      const selectedComp = companies.find((i) => i.id === companyId);
      dispatch(setSelectedCompany(selectedComp ? selectedComp.id : null));
    }
  };

  return (
    <div className="fixed-top" id="customer-top-menu">
      <nav className="navbar navbar-expand-md bg-white topHeader">
        <div className="container-fluid d-flex">
          <NavLink to="/" className="navbar-brand d-lg-block d-xl-block">
            <img src={logo} alt="Finkraft" width={120} />
          </NavLink>
          <ul className="navbar-nav mr-auto topRight">

            <li className="d-flex justify-content-between align-items-center mx-2 my-2">
              <NavLink to="/customer/notifications" className="btn btn-primary p-1 m-0 bg-color-purple-dark border-4 border-white position-relative rounded-pill menuIcon">
                <i className="fa-solid fa-bell m-1" />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  0
                  <span className="visually-hidden">unread messages</span>
                </span>
              </NavLink>
            </li>

            {/* Companies
            <CustomerTopMenuSelect
              options={companies.map((i) => ({ value: i.id, label: i.name }))}
              mark="fa-solid fa-building"
              placeholder="Companies"
              noOptionsMessage={() => 'No Companies available'}
              onChange={setSelectedCompanyOption}
              value={selectedCompany}
            />
            */}

            {/* Profile */}
            <CustomerTopMenuDropDown
              id="dropdown05"
              mark="fa-solid fa-user"
              title={userFullName ?? ''}
              items={profileItems}
            />

          </ul>
          <div className="topMenu">
            <button
              className="navbar-toggler closeIcon"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNavDropdown"
              aria-controls="navbarNavDropdown"
              aria-expanded="false"
              aria-label=""
            >
              <span />
              <span />
              <span />
            </button>
            <div className="collapse navbar-collapse d-flex-inline flex-wrap justify-content-between align-items-center" id="navbarNavDropdown">
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
                <li className="nav-item">
                  <NavLink to="/customer/library" className="nav-link">
                    Library
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/customer/demo" className="nav-link">
                    Demo
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <SecondaryCustomerTopMenu />

    </div>
  );
}
