import { TenantApiRequest } from '../app/utils/ApiRequests';

export interface OCRType {
  id: number;
  fileId: number;
  voucherNumber:number,
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

export async function fetchOCRData(): Promise<OCRType[] | null | Error> {
  return TenantApiRequest('ocr');
}
