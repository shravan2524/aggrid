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
    "document_type": "",
    "total_amount": 0,
    "irn": "",
    "irn_date": {},
    "items_count": 0,
    "hsn_code": "",
    "nic_sign": "",
    "qr_detected": false,
    "filename": "",
    "s3_url": "",
    "page_image_link": "",
    "row_updated_at": {},
    "extra_information": {}
  }
]
*/
export interface QRType {
  id: number,
  workspace: string,
  invoice_number: string,
  invoice_date: Record<any, never> | string | Date | null,
  seller_gstin: string,
  buyer_gstin: string,
  document_type: string,
  total_amount: number,
  irn: string,
  irn_date: Record<any, never> | string | Date | null,
  items_count: number,
  hsn_code: string,
  nic_sign: string,
  qr_detected: boolean,
  filename: string,
  s3_url: string,
  page_image_link: string,
  row_updated_at: Record<any, never> | string | Date | null,
  extra_information: Record<any, never>,
}

export async function fetchQRData() :Promise<QRType[] | null | Error> {
  const options: RequestInit = {
    method: 'GET',
    credentials: 'include',
  };

  const apiUrl = `${BACKEND_API}/api/v1/qr`;
  const response = await fetch(apiUrl, options);

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
}
