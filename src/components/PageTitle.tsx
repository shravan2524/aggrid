import React from 'react';
import { Helmet, HelmetData } from 'react-helmet-async';

interface PageTitleProps {
  title: string,
  icon?: string
}
const helmetData = new HelmetData({});
function PageTitle({ title, icon }:PageTitleProps) {
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
        <i className={icon} />
        {' '}
        {title}
      </h4>
    </div>

  );
}

PageTitle.defaultProps = {
  icon: 'fa-solid fa-circle-dot',
};

export default PageTitle;
