import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Router from './components/Router';

function AppRouter() {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}

export default AppRouter;
