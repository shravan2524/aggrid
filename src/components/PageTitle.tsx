import React from 'react';
import { Helmet, HelmetData } from 'react-helmet-async';

interface PageTitleProps {
  title: string
}
const helmetData = new HelmetData({});
export default function PageTitle({ title }:PageTitleProps) {
  return (
    <div>
      <Helmet helmetData={helmetData}>
        <title>
          Finkraft -
          {' '}
          {title}
        </title>
      </Helmet>
      <h4 className="pb-2 text-capitalize text-purple-dark">
        <i className="fa-solid fa-circle-dot" />
        {' '}
        {title}
      </h4>
    </div>

  );
}
