import { TenantApiRequest } from '../app/utils/ApiRequests';

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
  return TenantApiRequest('ewb');
}
