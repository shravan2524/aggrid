import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { Button, Modal } from 'react-bootstrap';
import './ColumnMapping.scss';
import { useAppDispatch, useWindowDimensions } from 'app/hooks';
import {
  fetchFiles, getFiles,
  setContentTypeRequest, setColumnMappingRequest,
} from 'state/files/filesSlice';
import { tenantUuid } from 'state/tenants/helper';
import { BACKEND_API } from 'app/config';
import { columns2A, columns2B, columnsPR } from './DBColumns';

interface Type {
  id: string;
  fileType: string;
}

export default function ColumnMapping({ fileType, id }: Type) {
  const [test, settest] = useState(true);
  const [tesColumnMapping, settesColumnMapping] = useState({
    AF: [
      '',
      '',
      '',
    ],
    Year: [
      '2019',
      '2019',
      '2019',
    ],
    GSTIN: [
      '06AABCG9446Q2ZX',
      '06AABCG9446Q2ZX',
      '06AABCG9446Q2ZX',
    ],
    Period: [
      '2',
      '2',
      '2',
    ],
    Remarks: [
      '',
      '',
      '',
    ],
    Section: [
      'B2.00',
      'B2.00',
      'B2.00',
    ],
    'Recon Id': [
      '',
      '',
      '',
    ],
    'Tax Rate': [
      '18',
      '18',
      '18',
    ],
    'Cess(Amt)': [
      '',
      '0',
      '0',
    ],
    'Port Code': [
      '',
      '',
      '',
    ],
    'Unique ID': [
      '06AAACB2894G1ZRINVOICE2019-02-03759673833',
      '06AAACC9308A1Z7INVOICE2019-02-28R184HR07099',
      '06AAACC9308A1Z7INVOICE2019-02-28R184HR07100',
    ],
    'CGST (Amt)': [
      '8573.93',
      '15786.09',
      '43169.31',
    ],
    'IGST (Amt)': [
      '',
      '0',
      '0',
    ],
    'Legal Name': [
      'BHARTI AIRTEL LIMITED',
      'CBRE SOUTH ASIA PRIVATE LIMITED',
      'CBRE SOUTH ASIA PRIVATE LIMITED',
    ],
    'Trade Name': [
      'BHARTI AIRTEL LIMITED',
      'CBRE SOUTH ASIA PVT LTD',
      'CBRE SOUTH ASIA PVT LTD',
    ],
    'Reco Action': [
      '',
      '',
      '',
    ],
    ActualReason: [
      '',
      '',
      '',
    ],
    'Company Code': [
      '7680',
      '7680',
      '7680',
    ],
    'Invoice Type': [
      'R',
      'R',
      'R',
    ],
    IsReconciled: [
      '',
      '',
      '',
    ],
    'Delinked Flag': [
      '',
      '',
      '',
    ],
    'Serial Number': [
      '1',
      '1',
      '1',
    ],
    'Reverse Charge': [
      'N',
      'N',
      'N',
    ],
    'Vendor Remarks': [
      '',
      '',
      '',
    ],
    'Downloaded date': [
      '20200917',
      '20200917',
      '20200917',
    ],
    'Place of Supply': [
      'Haryana',
      'Haryana',
      'Haryana',
    ],
    'SGST/UTGST (Amt)': [
      '8573.93',
      '15786.09',
      '43169.31',
    ],
    'State Description': [
      'Haryana',
      'Haryana',
      'Haryana',
    ],
    'Type of Amendment': [
      '',
      '',
      '',
    ],
    'GSTR-1 Filing Date': [
      '',
      '',
      '',
    ],
    'Company Description': [
      'Boston Scientific India Private Limited',
      'Boston Scientific India Private Limited',
      'Boston Scientific India Private Limited',
    ],
    'Mismatch Mapping ID': [
      '',
      '',
      '',
    ],
    'Payment Document No': [
      '',
      '',
      '',
    ],
    'Total taxable value': [
      '95265.89',
      '175401',
      '479659',
    ],
    'GSTR-1 Filing Status': [
      'Y',
      'Y',
      'Y',
    ],
    'GSTR-1 filing period': [
      '',
      '',
      '',
    ],
    'Actual Reason Remarks': [
      '',
      '',
      '',
    ],
    'GSTIN of the Supplier': [
      '06AAACB2894G1ZR',
      '06AAACC9308A1Z7',
      '06AAACC9308A1Z7',
    ],
    'GSTR-3B Filing Status': [
      '',
      '',
      '',
    ],
    'Payment Document Date': [
      '',
      '',
      '',
    ],
    'ASP 1.0 Transaction Id': [
      '',
      '',
      '',
    ],
    'Detailed Clarification': [
      '',
      '',
      '',
    ],
    'Is Manually Reconciled': [
      '',
      '',
      '',
    ],
    'Amendment Original Year': [
      '',
      '',
      '',
    ],
    'Invoice Check Sum Value': [
      'ff74580295fc32fbc794eab8f97da05a728a9b3619d402c3d5018a8b1cb93f6b',
      '8a06d180e64ffe3c34c5ce6b994d5733a8e3c9ce9dea0e657ef9069d6b74cda3',
      '24014749bf84a0b812f1550799faddd5d97935c7ac341664c63865bf8858a404',
    ],
    'Original Invoice Period': [
      '',
      '',
      '',
    ],
    'Comment for other reason': [
      '',
      '',
      '',
    ],
    'Note Type (Credit/Debit)': [
      '',
      '',
      '',
    ],
    'Supplier Name as per ERP': [
      '',
      '',
      '',
    ],
    'Invoice status (My Action)': [
      '',
      '',
      '',
    ],
    'Amendment (Original Period)': [
      '',
      '',
      '',
    ],
    'Pre GST Regime Dr./ Cr. Notes': [
      '',
      '',
      '',
    ],
    'Category as per reconciliation': [
      '',
      '',
      '',
    ],
    'Supplier GSTIN cancellation date': [
      '',
      '',
      '',
    ],
    'Sub-Category as per reconciliation': [
      '',
      '',
      '',
    ],
    'Reference Date of the Bill of Entry': [
      '',
      '',
      '',
    ],
    'Counter Party Flag (Supplier Action)': [
      '',
      '',
      '',
    ],
    'Amendment (Original GSTIN of supplier)': [
      '',
      '',
      '',
    ],
    'Debit Note/Credit Note (Original Invoice Date)': [
      '',
      '',
      '',
    ],
    'Debit Note/Credit Note (Original Invoice Number)': [
      '',
      '',
      '',
    ],
    'Supplier Invoice Debit Note/ Credit Note/ Bill of Entry (No)': [
      '759673833',
      'R184HR07099',
      'R184HR07100',
    ],
    'Supplier Invoice Debit Note/ Credit Note/ Bill of Entry (Date)': [
      '20190203',
      '20190228',
      '20190228',
    ],
    'Supplier Invoice Debit Note/ Credit Note/ Bill of Entry (Value)': [
      '112413.75',
      '206973.18',
      '565997.62',
    ],
    'Amendment (Original Invoice/Debit/Credit Note/ Bill of Entry)  No.': [
      '',
      '',
      '',
    ],
    'Amendment (Original Invoice/Debit/Credit Note/ Bill of Entry)  Date': [
      '',
      '',
      '',
    ],
  });
  const [columnMapping, setColumnMapping] = useState({});
  const [cols, setCols] = useState({
    '2A': columns2A,
    '2B': columns2B,
    PR: columnsPR,
  });
  const [columnGroups, setColumnGroups] = useState([]);

  const dispatch = useAppDispatch();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleSubmit = () => {
    setShow(false);
    dispatch(setColumnMappingRequest({
      columnMapping,
      data: id,
    }));
  };
  const [filedata, setfiledata] = useState<any[]>();
  const [contentPreview, setcontentPreview] = useState<any[]>();
  const handleShow = () => {
    setShow(true);
    const options: RequestInit = {
      method: 'GET',
      credentials: 'include',
    };
    const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/files/${id}`;
    fetch(apiUrl, options)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        throw new Error(response.statusText || 'Something is wrong');
      })
      .then((data1) => {
        setcontentPreview(data1.contentPreview || tesColumnMapping);
        const newColumnMapping = data1.columnMapping || {};
        // update columnType based on defaults
        Object.keys(newColumnMapping).forEach((k) => {
          const cm = newColumnMapping[k];
          if (!cm.columnType) {
            cm.columnType = cols[fileType].find((it) => it.columnName === cm.columnName)?.columnType || 'string';
            newColumnMapping[k] = cm;
          }
        });
        setColumnMapping(newColumnMapping);
      })
      .catch((e) => console.log(e));

    const apiUrlColumnGroups = `${BACKEND_API}/api/v1/${tenantUuid()}/column-groups`;
    fetch(apiUrlColumnGroups, options)
      .then((r) => {
        if (r.ok) {
          return r.json();
        }

        throw new Error(r.statusText || 'Something is wrong');
      })
      .then((d) => {
        setColumnGroups(d?.rows || d);
      })
      .catch((e) => console.log(e));
  };

  // console.log(filedata, id);

  const setMapping = (k) => {
    const fn = (e) => {
      const columnName = e.target.value;
      const newColumnMapping = { ...columnMapping };
      newColumnMapping[k] = newColumnMapping[k] || {};
      newColumnMapping[k].columnName = columnName;
      if (!newColumnMapping[k].columnType) {
        const ct = cols[fileType].find((it) => it.columnName === columnName);
        newColumnMapping[k].columnType = ct?.columnType || 'string';
      }

      // set the mapping
      setColumnMapping(newColumnMapping);
      // console.log(newColumnMapping);
    };
    return fn;
  };

  console.log(columnMapping);

  const setColumnGroup = (k) => {
    const fn = (e) => {
      const columnGroup = e.target.value;
      const newColumnMapping = { ...columnMapping };
      newColumnMapping[k] = newColumnMapping[k] || {};
      newColumnMapping[k].columnGroup = columnGroup;
      setColumnMapping(newColumnMapping);
    };

    return fn;
  };

  const setColumnType = (k) => {
    const fn = (e) => {
      const columnType = e.target.value;
      const newColumnMapping = { ...columnMapping };
      newColumnMapping[k] = newColumnMapping[k] || {};
      newColumnMapping[k].columnType = columnType;
      setColumnMapping(newColumnMapping);
    };

    return fn;
  };

  const notSelectedColumnsFilter = (keyName) => (a: any) => !(
    Object.values(columnMapping).find(
      (x: any) => (
        x.columnName === a.columnName // see if (x) is already selected
        && columnMapping[keyName]?.columnName !== a.columnName// and add also what has been selected
      ),
    )
  );

  return (
    <>
      <Button variant="primary" onClick={handleShow}>Column Mapping</Button>
      <Modal show={show} onHide={handleClose} size="xl" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>Column Mapping</Modal.Title>
        </Modal.Header>
        <Modal.Body className="mapping">
          {
            contentPreview
              ? (
                Object.keys(contentPreview).map((keyName, i) => (
                  <table key={i} className={`columnMapping ${columnMapping[keyName]?.columnName ? 'columnMappingActive' : ''}`}>
                    <tbody>
                      <tr>
                        <th>
                          <div>
                            <span>{keyName}</span>
                            <select onChange={setMapping(keyName)} value={columnMapping[keyName]?.columnName}>
                              <option value="">-- column --</option>
                              {
                                cols[fileType].filter(notSelectedColumnsFilter(keyName)).map((e, idx) => (<option key={idx} value={e.columnName}>{e.columnTitle || e.columnName}</option>))
                              }
                            </select>
                            <select onChange={setColumnGroup(keyName)} value={columnMapping[keyName]?.columnGroup} className="ms-2">
                              <option value="">-- column group --</option>
                              {
                                columnGroups.map((e: any, idx) => <option key={idx} value={e.id}>{e.title}</option>)
                              }
                            </select>
                          </div>
                        </th>
                      </tr>
                      {
                        contentPreview[keyName]?.map(
                          (e, idx) => {
                            e = e || ' ';
                            return (<tr key={idx}><td>{e}</td></tr>);
                          },
                        )
                      }
                    </tbody>
                  </table>
                )))
              : null
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
