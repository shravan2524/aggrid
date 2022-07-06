import { TenantApiRequest } from '../app/utils/ApiRequests';

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
  return TenantApiRequest('gstr2b');
}
