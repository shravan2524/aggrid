import { TenantApiRequest } from '../app/utils/ApiRequests';

export interface ReconciliationType {

}

// TODO: This api doesn't exist yet
export async function fetchReconciliationData() :Promise<ReconciliationType[] | null | Error> {
  return TenantApiRequest('reconciliation');
}
