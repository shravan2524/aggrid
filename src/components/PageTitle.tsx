import React from 'react';
import { Helmet, HelmetData } from 'react-helmet-async';

interface PageTitleProps {
  title: string
}
const helmetData = new HelmetData({});
export default function PageTitle({ title }:PageTitleProps) {
  return (
    <Helmet helmetData={helmetData}>
      <title>
        Finkraft -
        {' '}
        {title}
      </title>
    </Helmet>

  );
}
