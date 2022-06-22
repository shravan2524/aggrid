import React from 'react';
import { NavLink } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { BACKEND_API } from '../../app/config';

type CustomerTopMenuDropDownItemsTypes = {
  itemTitle?: string | undefined;
  itemPath?: string | undefined;
  itemExternal?: boolean | undefined,
  icon?: string | undefined;
  divider?: boolean | undefined;
  itemHide?: boolean | undefined
};

type CustomerTopMenuDropDownProps = {
  title: string;
  items: CustomerTopMenuDropDownItemsTypes[];
  id: string;
  hide?: boolean | undefined,
  mark?: string;
};

function CustomerTopMenuDropDown({
  title, items, id, hide, mark,
}:CustomerTopMenuDropDownProps) {
  if (hide) {
    return null;
  }

  return (
    <li className="nav-item dropdown mx-2 my-2">
      <a
        className="nav-link dropdown-toggle form-select p-0 bg-white border-4 border-white rounded-pill d-flex justify-content-between align-items-center"
        href="#"
        id="dropdown05"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <strong className="rounded-circle bg-color-purple text-white p-1 m-0">
          <span className="badge rounded-pill bg-color-purple-dark p-2">
            {mark ? (<i className={mark} />) : mark}
          </span>
        </strong>
        <span className="text-purple-dark mx-3 pe-3">{title}</span>
      </a>

      <ul className="dropdown-menu" aria-labelledby={id}>
        {items.map(({
          itemTitle,
          itemPath,
          itemExternal,
          icon,
          divider,
          itemHide,
        }, i) => {
          if (divider) {
            return (
              <li key={`${i}${id}${uuidv4()}${title}`}>
                <hr className="dropdown-divider" />
              </li>
            );
          }

          if (itemHide) {
            return null;
          }

          if (!itemPath) {
            return null;
          }

          if (itemPath === '#') {
            return (
              <li key={`${title}${i}${id}${uuidv4()}`}>
                <small className="dropdown-item-text text-muted text-uppercase">
                  <i className="fa-solid fa-check" />
                  {' '}
                  {itemTitle}
                </small>
              </li>
            );
          }

          return (
            <li key={`${i}${title}${id}${itemTitle}${uuidv4()}`}>

              {itemExternal
                ? (
                  <a href={itemPath} className="dropdown-item">
                    {icon && (<i className={icon} />) }
                    {' '}
                    {itemTitle}
                  </a>
                )
                : (
                  <NavLink to={itemPath} className="dropdown-item">
                    {icon && (<i className={icon} />) }
                    {' '}
                    {itemTitle}
                  </NavLink>
                )}
            </li>
          );
        })}

      </ul>
    </li>
  );
}

CustomerTopMenuDropDown.defaultProps = {
  hide: false,
  mark: 'fa-solid fa-p',
};

export default CustomerTopMenuDropDown;
