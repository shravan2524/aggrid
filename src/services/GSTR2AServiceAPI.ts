import { TenantApiRequest } from '../app/utils/ApiRequests';

export interface GSTR2AType {
  id: number;
  fileId: number;
  invoice_number: string;
  invoice_date: Record<any, never> | string | Date | null;
  seller_gstin: string;
  buyer_gstin: string;
  filing_period: Record<any, never> | string | Date | null;
  document_type: string;
  original_invoice_number: string;
  original_invoice_date: Record<any, never> | string | Date | null;
  total_amount: number;
  igst: number;
  cgst: number;
  sgst: number;
  total_gst: number;
  taxable_amount: number;
  tax_rate: number;
  irn: string;
  irnDate: string;
  rowUpdateDate: string;
  extraColumns: any;
}

export async function fetchGSTR2AData(): Promise<GSTR2AType[] | null | Error> {
  return TenantApiRequest('gstr2a');
}
