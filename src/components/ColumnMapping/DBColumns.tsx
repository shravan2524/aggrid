const sortFn = (a, b) => {
  if (a.columnTitle === b.columnTitle) {
    if (a.columnName < b.columnName) {
      return -1;
    }

    return 1;
  }

  if (a.columnTitle < b.columnTitle) {
    return -1;
  }

  return 1;
};

export const columns2A = [
  {
    columnName: 'invoiceNumber',
    columnTitle: 'Invoice Number',
    selected: '',
  },
  {
    columnName: 'sellerGSTIN',
    columnTitle: 'Seller/Vendor GSTIN',
    selected: '',
  },
  {
    columnName: 'buyerGSTIN',
    columnTitle: 'Buyer/Company GSTIN',
    selected: '',
  },
  {
    columnName: 'invoiceDate',
    columnTitle: 'Invoice Date',
    selected: '',
  },
  {
    columnName: 'filingPeriod',
    columnTitle: 'Filling Period',
    selected: '',
  },
  {
    columnName: 'documentType',
    columnTitle: 'Document Type',
    selected: '',
  },
  {
    columnName: 'originalInvoiceNumber',
    columnTitle: 'Original Invoice Number',
    selected: '',
  },
  {
    columnName: 'originalInvoiceDate',
    columnTitle: 'Original Invoice Date',
    selected: '',
  },
  {
    columnName: 'totalAmount',
    columnTitle: 'Total Amount',
    selected: '',
  },
  {
    columnName: 'igst',
    columnTitle: 'IGST',
    selected: '',
  },
  {
    columnName: 'sgst',
    columnTitle: 'SGST',
    selected: '',
  },
  {
    columnName: 'cgst',
    columnTitle: 'CGST',
    selected: '',
  },
  {
    columnName: 'totalGst',
    columnTitle: 'Total GST',
    selected: '',
  },
  {
    columnName: 'taxableAmount',
    columnTitle: 'Taxable Amount',
    selected: '',
  },
  {
    columnName: 'taxRate',
    columnTitle: 'Tax Rate',
    selected: '',
  },
  {
    columnName: 'irn',
    columnTitle: 'IRN',
    selected: '',
  },
  {
    columnName: 'rowUpdateDate',
    columnTitle: 'Row Updated At',
    selected: '',
  },
  {
    columnName: 'irnDate',
    columnTitle: 'IRN Date',
    selected: '',
  },
].sort(sortFn);

export const columns2B = [
  {
    columnName: 'invoiceNumber',
    columnTitle: 'Invoice Number',
    selected: '',
  },
  {
    columnName: 'sellerGSTIN',
    selected: '',
  },
  {
    columnName: 'buyerGSTIN',
    selected: '',
  },
  {
    columnName: 'invoiceDate',
    selected: '',
  },
  {
    columnName: 'filingPeriod',
    selected: '',
  },
  {
    columnName: 'documentType',
    selected: '',
  },
  {
    columnName: 'originalInvoiceNumber',
    selected: '',
  },
  {
    columnName: 'originalInvoiceDate',
    selected: '',
  },
  {
    columnName: 'totalAmount',
    selected: '',
  },
  {
    columnName: 'igst',
    selected: '',
  },
  {
    columnName: 'sgst',
    selected: '',
  },
  {
    columnName: 'cgst',
    selected: '',
  },
  {
    columnName: 'totalGst',
    selected: '',
  },
  {
    columnName: 'taxableAmount',
    selected: '',
  },
  {
    columnName: 'taxRate',
    selected: '',
  },
  {
    columnName: 'irn',
    selected: '',
  },
  {
    columnName: 'rowUpdateDate',
    selected: '',
  },
  {
    columnName: 'irnDate',
    selected: '',
  },
  {
    columnName: 'itcAvailability',
    selected: '',
  },
  {
    columnName: 'reason',
    selected: '',
  },
  {
    columnName: 'applicablePercentOfTaxRate',
    selected: '',
  },
].sort(sortFn);

export const columnsPR = [
  {
    columnName: 'invoiceNumber',
    columnTitle: 'Invoice Number',
    selected: '',
  },
  {
    columnName: 'sellerGSTIN',
    selected: '',
  },
  {
    columnName: 'buyerGSTIN',
    selected: '',
  },
  {
    columnName: 'invoiceDate',
    selected: '',
  },
  {
    columnName: 'filingPeriod',
    selected: '',
  },
  {
    columnName: 'documentType',
    selected: '',
  },
  {
    columnName: 'originalInvoiceNumber',
    selected: '',
  },
  {
    columnName: 'originalInvoiceDate',
    selected: '',
  },
  {
    columnName: 'totalAmount',
    selected: '',
  },
  {
    columnName: 'igst',
    selected: '',
  },
  {
    columnName: 'sgst',
    selected: '',
  },
  {
    columnName: 'cgst',
    selected: '',
  },
  {
    columnName: 'totalGst',
    selected: '',
  },
  {
    columnName: 'taxableAmount',
    selected: '',
  },
  {
    columnName: 'taxRate',
    selected: '',
  },
  {
    columnName: 'irn',
    selected: '',
  },
  {
    columnName: 'fileName',
    selected: '',
  },
  {
    columnName: 'VoucherNumber',
    selected: '',
  },
  {
    columnName: 'rowUpdateDate',
    selected: '',
  },
].sort(sortFn);

export default {
  columns2A,
  columns2B,
  columnsPR,
};
