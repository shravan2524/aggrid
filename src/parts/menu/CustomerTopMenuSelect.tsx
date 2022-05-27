import React, { MouseEventHandler, useMemo, useState } from 'react';
import Select, { ActionMeta, SingleValue } from 'react-select';
import classNames from 'classnames';

export type CustomerTopMenuSelectItemType = {
  value: string | number | undefined;
  label: string | number | undefined;
};

type CustomerTopMenuSelectProps = {
  options: CustomerTopMenuSelectItemType[];
  buttonOnClickCallback?:MouseEventHandler | null
  onChange?:(newValue: any, actionMeta: ActionMeta<any>) => void | undefined;
  selectedOption?: CustomerTopMenuSelectItemType | null;
  isMulti?: boolean;
  isSearchable?: boolean;
  placeholder?: string | undefined;
  noOptionsMessage?: ({ inputValue: string }) => string | undefined;
  value? :CustomerTopMenuSelectItemType | undefined;
  mark?: string;
};

const defaultProps = {
  buttonOnClickCallback: null,
  onChange: undefined,
  selectedOption: null,
  isMulti: false,
  isSearchable: false,
  placeholder: undefined,
  noOptionsMessage: undefined,
  value: undefined,
  mark: 'P',
};

function CustomerTopMenuSelect({
  options,
  buttonOnClickCallback,
  onChange,
  selectedOption,
  isMulti,
  isSearchable,
  placeholder,
  noOptionsMessage,
  value,
  mark,
}: CustomerTopMenuSelectProps) {
  const customStyles = useMemo(() => ({
    control: (provided) => ({
      ...provided,
      border: 'none',
      minWidth: '150px',
    }),
    container: (provided) => ({
      ...provided,
      width: '100%',
      border: 'none',
    }),
    menu: (provided, state) => ({
      ...provided,
      zIndex: '9999999',
    }),

    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#282952' : 'white',
    }),

  }), []);

  return (
    <li className="nav-item dropdown mx-2 my-2">
      <div className="bg-white rounded-pill text-dark d-flex justify-content-between align-items-center p-1">
        <strong className="rounded-circle bg-color-purple text-white p-1">
          <span className="badge rounded-pill bg-color-purple-dark p-2">{mark ? (<i className={mark} />) : mark}</span>
        </strong>

        <div className={classNames(['w-100', { 'mx-2': !buttonOnClickCallback }])}>
          <Select
            onChange={onChange}
            options={options}
            isMulti={isMulti}
            defaultValue={selectedOption}
            styles={customStyles}
            isSearchable={isSearchable}
            placeholder={placeholder}
            noOptionsMessage={noOptionsMessage}
            value={value}
          />
        </div>

        {buttonOnClickCallback && (
          <strong className="rounded-circle p-1">
            <button type="button" onClick={buttonOnClickCallback} className="btn btn-sm btn-light bg-white border-0 rounded text-dark">
              <i className="fa-solid fa-circle-plus" />
            </button>
          </strong>
        ) }
      </div>
    </li>
  );
}

CustomerTopMenuSelect.defaultProps = defaultProps;

export default CustomerTopMenuSelect;
