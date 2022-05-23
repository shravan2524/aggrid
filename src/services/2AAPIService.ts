import { BACKEND_API } from '../app/config';

/*
[
  {
    "id": 1,
    "workspace": "",
    "invoice_number": "",
    "invoice_date": {},
    "seller_gstin": "",
    "buyer_gstin": "",
    "filing_period": {},
    "document_type": "",
    "original_invoice_number": "",
    "original_invoice_date": {},
    "total_amount": 0,
    "igst": 0,
    "cgst": 0,
    "sgst": 0,
    "total_gst": 0,
    "taxable_amount": 0,
    "tax_rate": 0,
    "irn": "",
    "irn_date": {},
    "row_updated_at": {},
    "extra_information": {}
  }
]
*/
export interface TwoAType {
  id: number,
  workspace: string,
  invoice_number: string,
  invoice_date: Record<any, never> | string | Date | null,
  seller_gstin: string,
  buyer_gstin: string,
  filing_period: Record<any, never> | string | Date | null,
  document_type: string,
  original_invoice_number: string,
  original_invoice_date: Record<any, never> | string | Date | null,
  total_amount: number,
  igst: number,
  cgst: number,
  sgst: number,
  total_gst: number,
  taxable_amount: number,
  tax_rate: number,
  irn: string,
  irn_date: Record<any, never> | string | Date | null,
  row_updated_at: Record<any, never> | string | Date | null,
  extra_information: Record<any, never>,
}

export async function fetch2AData() :Promise<TwoAType[] | null | Error> {
  const options: RequestInit = {
    method: 'GET',
    credentials: 'include',
  };

  const apiUrl = `${BACKEND_API}/api/v1/2a`;
  const response = await fetch(apiUrl, options);

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
}
