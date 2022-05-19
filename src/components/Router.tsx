import { useRoutes } from 'react-router-dom';
import React from 'react';
import routes from 'app/routes';

export default function Router() {
  return useRoutes(routes);
}
