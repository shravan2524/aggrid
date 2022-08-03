import { TenantApiRequest } from '../app/utils/ApiRequests';

export interface ReconciliationType {

}

/*
export async function fetchReconciliationData(payload):Promise<ReconciliationType[] | null | Error> {
  return TenantApiRequest(`files/${payload.id}/reconciliation/getAll`, 'POST', payload.dataRequest);
}
*/

export async function fetchReconciliationData(payload):Promise<any> {
  return TenantApiRequest('reconciliation/getAll', 'POST', payload.dataRequest);
}
