import React from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import PageTitle from './PageTitle';
import { isSecondaryMenuItemVisible } from '../state/settings/settingsSlice';

import './PageWrapper.scss';

type PageWrapperProps = {
  pageTitle: string;
  children: JSX.Element;
};

export default function PageWrapper({ children, pageTitle }:PageWrapperProps) {
  const secondaryMenuItemVisible = useSelector(isSecondaryMenuItemVisible);

  return (
    <div className={classNames(['container-fluid', { 'page-wrapper-with-submenu': secondaryMenuItemVisible }])}>
      <PageTitle title={pageTitle} />
      <div className="row">
        {children}
      </div>
    </div>
  );
}
