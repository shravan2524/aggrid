import React, { useMemo } from 'react';
import { getAuthFullNameFromLocal } from 'services/authService';

export function UserFullNameMenuItem() {
  const userFullName = useMemo(() => getAuthFullNameFromLocal(), []);

  return (<a className="nav-link dropdown-toggle" href="#" id="dropdown05" data-bs-toggle="dropdown" aria-expanded="false">{userFullName}</a>);
}
