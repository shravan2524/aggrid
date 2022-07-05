import { tenantUuid } from 'state/tenants/helper';
import { BACKEND_API } from '../app/config';
import { handleRequestError } from '../app/utils/ApiRequests';

export interface GSTR2BType {
  id: number;
  fileId: number;
  invoice_number: string;
  invoice_date: Record<any, never> | string | Date | null;
  seller_gstin: string;
  buyer_gstin: string;
  filing_period: Record<any, never> | string | Date | null;
  document_type: string;
  originalInvoiceNumber: string;
  originalInvoiceDate: Record<any, never> | string | Date | null;
  totalAmount: number;
  igst: number;
  cgst: number;
  sgst: number;
  totalGst: number;
  taxableAmount: number;
  taxRate: number;
  irn: string;
  irnDate: string;
  rowUpdateDate: string;
  extraColumns: any;
  itcAvailability: string;
  reason: string;
  applicablePercentOfTaxRate: string;
}

export async function fetchGSTR2BData(): Promise<GSTR2BType[] | null | Error> {
  const options: RequestInit = {
    method: 'GET',
    credentials: 'include',
  };

  const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/gstr2b`;
  const response = await fetch(apiUrl, options);

  if (!response.ok) {
    await handleRequestError(response);
  }
  return response.json();
}
