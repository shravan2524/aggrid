import React, { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logo from 'logo-white.svg';
import { selectSecondaryMenuItems } from 'state/settings/settingsSlice';

import './CustomerTopMenu.scss';
import { getAuthFullNameFromLocal } from 'services/authService';
import { useAppDispatch } from 'app/hooks';

import {
  fetchCustomers, selectAllCustomers, selectSelectedCustomer, setSelectedCustomer,
} from 'state/customers/customersSlice';

import {
  fetchCompanies, getAllCompanies,
  selectSelectedCompany,
  setSelectedCompany,
} from 'state/companies/companiesSlice';
import { CompaniesType } from 'services/companiesAPIService';
import CustomerTopMenuDropDown from './CustomerTopMenuDropDown';
import CustomerTopMenuSelect, { CustomerTopMenuSelectItemType } from './CustomerTopMenuSelect';

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
      <div className="container">
        <nav className="nav nav-underline" aria-label="Secondary navigation">
          {secondaryMenuItems.map((itm, i) => <NavLink key={`${itm.path}${i}`} to={itm.path} replace className="nav-link">{itm.text}</NavLink>)}
        </nav>
      </div>
    </div>
  );
}

export default function CustomerTopMenu() {
  const dispatch = useAppDispatch();

  const userFullName = useMemo(() => getAuthFullNameFromLocal(), []);

  // Customers ...
  const [customers, setCustomers] = useState<CustomerTopMenuSelectItemType[]>([]);
  const customersSelector = useSelector(selectAllCustomers);
  const selectedCustomer = useSelector(selectSelectedCustomer);

  // Companies ....
  const [companies, setCompanies] = useState<CustomerTopMenuSelectItemType[]>([]);
  const [chosenCompany, setChosenCompany] = useState<CustomerTopMenuSelectItemType | undefined>(undefined);
  const companiesSelector = useSelector(getAllCompanies);
  const selectedCompanySelector = useSelector(selectSelectedCompany);

  const profileItems = useMemo(() => [
    {
      itemTitle: 'Profile',
      itemPath: '/customer/profile',
      icon: 'fa-solid fa-user',
    },
    {
      itemTitle: 'Customers',
      itemPath: '/customer/customers',
      icon: 'fa-solid fa-users',
    },
    {
      itemTitle: 'Companies',
      itemPath: '/customer/companies',
      icon: 'fa-solid fa-building',
    },
    {
      divider: true,
    },
    {
      itemTitle: 'Logout',
      itemPath: '/auth/logout',
      icon: 'fa-solid fa-right-from-bracket',
    },
  ], []);

  // Set customers in select component...
  useEffect(() => {
    if (customersSelector) {
      setCustomers(customersSelector);
    }
  }, [customersSelector]);

  const setSelectedCustomerOption = (e) => {
    dispatch(setSelectedCustomer(e.value));
  };

  // If selected customer then we must change
  useEffect(() => {
    dispatch(setSelectedCompany(null));

    if (selectedCustomer) {
      const filteredCompanies = companiesSelector.filter((c) => (Number(c.customer_id) === Number(selectedCustomer.id)));
      setCompanies(filteredCompanies.map((i:CompaniesType) => ({ value: i.id, label: i.name })));

      if (filteredCompanies.length) {
        dispatch(setSelectedCompany(filteredCompanies[0].id));
      }
    }
  }, [selectedCustomer]);

  useEffect(() => {
    if (selectedCompanySelector) {
      setChosenCompany({ label: selectedCompanySelector?.name, value: selectedCompanySelector?.id });
    } else {
      setChosenCompany(undefined);
    }
  }, [selectedCompanySelector]);

  const setSelectedCompanyOption = (e) => {
    dispatch(setSelectedCompany(e.value));
  };

  return (
    <div className="fixed-top" id="customer-top-menu">
      <nav className="navbar navbar-expand-md navbar-dark bg-color-purple-dark">
        <div className="container-fluid d-flex flex-wrap">
          <NavLink to="/" className="navbar-brand d-md-none d-lg-block d-lg-none d-xl-block">
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
            </ul>
            <ul className="navbar-nav mr-auto ">

              <li className="d-flex justify-content-between align-items-center mx-2 my-2">
                <NavLink to="/customer/notifications" className="btn btn-primary p-1 m-0 bg-color-purple-dark border-4 border-white position-relative rounded-pill">
                  <i className="fa-solid fa-bell m-1" />
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    0
                    <span className="visually-hidden">unread messages</span>
                  </span>
                </NavLink>
              </li>

              {/*    <CustomerTopMenuCompaniesItem /> */}
              {/* Companies */}
              <CustomerTopMenuSelect
                options={companies}
                mark="C"
                placeholder="Companies"
                noOptionsMessage={() => 'No Companies available'}
                onChange={setSelectedCompanyOption}
                value={chosenCompany}
              />

              {/* Customers */}
              <CustomerTopMenuSelect
                options={customers}
                mark="C"
                placeholder="Customers"
                noOptionsMessage={() => 'No Customers available'}
                onChange={setSelectedCustomerOption}
                value={{ label: selectedCustomer?.title, value: selectedCustomer?.id }}
              />

              {/* Profile */}
              <CustomerTopMenuDropDown
                id="dropdown05"
                title={userFullName ?? ''}
                items={profileItems}
              />

            </ul>
          </div>
        </div>
      </nav>

      <SecondaryCustomerTopMenu />

    </div>
  );
}
