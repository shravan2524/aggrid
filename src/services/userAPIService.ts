import { tenantUuid as tenantUuidFn } from 'state/tenants/helper';
import { ApiRequest } from '../app/utils/ApiRequests';

export async function fetchUserMeData() {
  return ApiRequest('auth/me');
}

export async function fetchUserDataForTenant(tenantUuid = '') {
  tenantUuid = tenantUuid || tenantUuidFn();

  return ApiRequest(`auth/me/${tenantUuid}`);
}
