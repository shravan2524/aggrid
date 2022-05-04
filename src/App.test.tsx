import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './state/store';
import AppRouter from './AppRouter';

test('renders learn react link', () => {
  const { getByText } = render(
    <Provider store={store}>
      <AppRouter />
    </Provider>,
  );

  expect(getByText(/learn/i)).toBeInTheDocument();
});
