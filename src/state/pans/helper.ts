import { store } from '../store';

const tenantUuid = () => {
  const state = store.getState();
  return state?.tenants?.selectedTenantUuid || sessionStorage.getItem('tenantUuid') || '';
};

export {
  tenantUuid,
};
