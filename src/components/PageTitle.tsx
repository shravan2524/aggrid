import React from 'react';
import { Helmet } from 'react-helmet';

interface PageTitleProps {
  title: string
}

export default function PageTitle({ title }:PageTitleProps) {
  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>

  );
}
