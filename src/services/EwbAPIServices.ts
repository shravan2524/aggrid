import { tenantUuid } from 'state/tenants/helper';
import { BACKEND_API } from '../app/config';
import { handleRequestError } from '../app/utils/ApiRequests';

export interface EWBType {
  id: number;
  fileId: number;
  tenantId: number;
  ewbNumber: string;
  ewbDate: string;
  docNumber: string;
  docDate: string;
  generatedBy: string;
  from: string;
  to: string;
  buyerGSTIN: string;
  status: string;
  noOfItems: string;
  mainHSNCode: string;
  hsnDesc: string;
  totalInvoiceValue: string;
  validTillDate: string;
  modeOfGen: string;
  rowUpdateDate: string;
  createdBy: number;
  extraColumns:any
}

export async function fetchEWBData(): Promise<EWBType[] | null | Error> {
  const options: RequestInit = {
    method: 'GET',
    credentials: 'include',
  };

  const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/ewb`;
  const response = await fetch(apiUrl, options);

  if (!response.ok) {
    await handleRequestError(response);
  }
  return response.json();
}
