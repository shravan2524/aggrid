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
import { BACKEND_API } from 'app/config';

interface Type {
  id: string;
  fileType: string;
}

export default function ColumnMapping({ fileType, id } :Type) {
  const [test, settest] = useState(true);
  const [column2A, setcolumn2A] = useState([
    {
      columnName: 'id',
      columnType: '',
    },
    {
      columnName: 'customerFileId',
      columnType: '',
    },
    {
      columnName: 'workspace',
      columnType: '',
    },
    {
      columnName: 'invoiceNumber',
      columnType: '',
    },
    {
      columnName: 'sellerGSTIN',
      columnType: '',
    },
    {
      columnName: 'buyerGSTIN',
      columnType: '',
    },
    {
      columnName: 'invoiceDate',
      columnType: '',
    },
    {
      columnName: 'filingPeriod',
      columnType: '',
    },
    {
      columnName: 'documentType',
      columnType: '',
    },
    {
      columnName: 'originalInvoiceNumber',
      columnType: '',
    },
    {
      columnName: 'originalInvoiceDate',
      columnType: '',
    },
    {
      columnName: 'totalAmount',
      columnType: '',
    },
    {
      columnName: 'igst',
      columnType: '',
    },
    {
      columnName: 'sgst',
      columnType: '',
    },
    {
      columnName: 'cgst',
      columnType: '',
    },
    {
      columnName: 'totalGst',
      columnType: '',
    },
    {
      columnName: 'taxableAmount',
      columnType: '',
    },
    {
      columnName: 'taxRate',
      columnType: '',
    },
    {
      columnName: 'irn',
      columnType: '',
    },
    {
      columnName: 'rowUpdateDate',
      columnType: '',
    },
    {
      columnName: 'irnDate',
      columnType: '',
    },
    {
      columnName: 'extraColumns',
      columnType: '',
    },
    {
      columnName: 'createdBy',
      columnType: '',
    },
    {
      columnName: 'createdAt',
      columnType: '',
    },
    {
      columnName: 'modifiedBy',
      columnType: '',
    },
    {
      columnName: 'modifiedAt',
      columnType: '',
    },
    {
      columnName: 'errors',
      columnType: '',
    },
  ]);
  const [column2B, setcolumn2B] = useState([
    {
      columnName: 'id',
      columnType: '',
    },
    {
      columnName: 'customerFileId',
      columnType: '',
    },
    {
      columnName: 'workspace',
      columnType: '',
    },
    {
      columnName: 'invoiceNumber',
      columnType: '',
    },
    {
      columnName: 'sellerGSTIN',
      columnType: '',
    },
    {
      columnName: 'buyerGSTIN',
      columnType: '',
    },
    {
      columnName: 'invoiceDate',
      columnType: '',
    },
    {
      columnName: 'filingPeriod',
      columnType: '',
    },
    {
      columnName: 'documentType',
      columnType: '',
    },
    {
      columnName: 'originalInvoiceNumber',
      columnType: '',
    },
    {
      columnName: 'originalInvoiceDate',
      columnType: '',
    },
    {
      columnName: 'totalAmount',
      columnType: '',
    },
    {
      columnName: 'igst',
      columnType: '',
    },
    {
      columnName: 'sgst',
      columnType: '',
    },
    {
      columnName: 'cgst',
      columnType: '',
    },
    {
      columnName: 'totalGst',
      columnType: '',
    },
    {
      columnName: 'taxableAmount',
      columnType: '',
    },
    {
      columnName: 'taxRate',
      columnType: '',
    },
    {
      columnName: 'irn',
      columnType: '',
    },
    {
      columnName: 'rowUpdateDate',
      columnType: '',
    },
    {
      columnName: 'irnDate',
      columnType: '',
    },
    {
      columnName: 'itcAvailability',
      columnType: '',
    },
    {
      columnName: 'reason',
      columnType: '',
    },
    {
      columnName: 'applicablePercentOfTaxRate',
      columnType: '',
    },
    {
      columnName: 'extraColumns',
      columnType: '',
    },
    {
      columnName: 'createdBy',
      columnType: '',
    },
    {
      columnName: 'createdAt',
      columnType: '',
    },
    {
      columnName: 'modifiedBy',
      columnType: '',
    },
    {
      columnName: 'modifiedAt',
      columnType: '',
    },
    {
      columnName: 'errors',
      columnType: '',
    },
  ]);
  const [columnPR, setcolumnPR] = useState([
    {
      columnName: 'id',
      columnType: '',
    },
    {
      columnName: 'customerFileId',
      columnType: '',
    },
    {
      columnName: 'workspace',
      columnType: '',
    },
    {
      columnName: 'invoiceNumber',
      columnType: '',
    },
    {
      columnName: 'sellerGSTIN',
      columnType: '',
    },
    {
      columnName: 'buyerGSTIN',
      columnType: '',
    },
    {
      columnName: 'invoiceDate',
      columnType: '',
    },
    {
      columnName: 'filingPeriod',
      columnType: '',
    },
    {
      columnName: 'documentType',
      columnType: '',
    },
    {
      columnName: 'originalInvoiceNumber',
      columnType: '',
    },
    {
      columnName: 'originalInvoiceDate',
      columnType: '',
    },
    {
      columnName: 'totalAmount',
      columnType: '',
    },
    {
      columnName: 'igst',
      columnType: '',
    },
    {
      columnName: 'sgst',
      columnType: '',
    },
    {
      columnName: 'cgst',
      columnType: '',
    },
    {
      columnName: 'totalGst',
      columnType: '',
    },
    {
      columnName: 'taxableAmount',
      columnType: '',
    },
    {
      columnName: 'taxRate',
      columnType: '',
    },
    {
      columnName: 'irn',
      columnType: '',
    },
    {
      columnName: 'fileName',
      columnType: '',
    },
    {
      columnName: 'VoucherNumber',
      columnType: '',
    },
    {
      columnName: 'rowUpdateDate',
      columnType: '',
    },
    {
      columnName: 'extraColumns',
      columnType: '',
    },
    {
      columnName: 'createdBy',
      columnType: '',
    },
    {
      columnName: 'createdAt',
      columnType: '',
    },
    {
      columnName: 'modifiedBy',
      columnType: '',
    },
    {
      columnName: 'modifiedAt',
      columnType: '',
    },
    {
      columnName: 'errors',
      columnType: '',
    },
  ]);
  const [column, setcolumn] = useState([
    {
      column_mapping_for_file: {
      },
    },
  ]);

  function onchange(keyName, e) {
    if (fileType === '2A') {
      const tempcontentTypeselect = column2A;
      const ind = tempcontentTypeselect.findIndex((v) => v.columnName === e.target.value);
      tempcontentTypeselect[ind].columnType = keyName;
      const tempcol = {
        keyName: {
          columnName: tempcontentTypeselect[ind].columnName,
        },
      };
      console.log(tempcol, keyName, e.target.value);
      setcolumn2A(tempcontentTypeselect);
      settest(!test);
    } else if (fileType === '2B') {
      const tempcontentTypeselect = column2B;
      const ind = tempcontentTypeselect.findIndex((v) => v.columnName === e.target.value);
      tempcontentTypeselect[ind].columnType = keyName;
      setcolumn2B(tempcontentTypeselect);
      const tempcol = {
        keyName: {
          columnName: tempcontentTypeselect[ind],
        },
      };
      console.log(tempcol);
      settest(!test);
    } else {
      const tempcontentTypeselect = columnPR;
      const ind = tempcontentTypeselect.findIndex((v) => v.columnName === e.target.value);
      tempcontentTypeselect[ind].columnType = keyName;
      setcolumnPR(tempcontentTypeselect);
      const tempcol = {
        keyName: {
          columnName: tempcontentTypeselect[ind],
        },
      };
      console.log(tempcol);
      settest(!test);
    }
  }
  const dispatch = useAppDispatch();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleSubmit = () => {
    setShow(false);
    console.log(column2A, 'column2A');
    if (fileType === '2A') {
      dispatch(setColumnMappingRequest({ column_mapping_for_file: column2A, data: id }));
    } else if (fileType === '2B') {
      dispatch(setColumnMappingRequest({ column_mapping_for_file: column2B, data: id }));
    } else {
      dispatch(setColumnMappingRequest({ column_mapping_for_file: columnPR, data: id }));
    }
  };
  const [contentPreview, setcontentPreview] = useState();
  const handleShow = () => {
    setShow(true);
    const options: RequestInit = {
      method: 'GET',
      credentials: 'include',
    };
    const apiUrl = `${BACKEND_API}/api/v1/files/${id}/preview`;
    fetch(apiUrl, options)
      .then((response) => response.json())
      .then((data1) => setcontentPreview(data1.contentPreview));
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>Column Mapping</Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            contentPreview
              ? (
                Object.keys(contentPreview).map((keyName, i) => (
                  <table key={i}>
                    <tr>
                      <th>
                        <div>
                          <span>{ keyName }</span>
                          <select onChange={(e1) => onchange(keyName, e1)}>
                            <option>Column Mapping : </option>
                            {
                              (fileType === '2A')
                                ? column2A.map((e) => (
                                  (e.columnType === keyName || e.columnType === '')
                                    ? <option key={e.columnName}>{e.columnName}</option>
                                    : null
                                ))
                                : (fileType === '2B')
                                  ? column2B.map((e) => (
                                    (e.columnType === keyName || e.columnType === '')
                                      ? <option key={e.columnName}>{e.columnName}</option>
                                      : null
                                  ))
                                  : columnPR.map((e) => (
                                    (e.columnType === keyName || e.columnType === '')
                                      ? <option key={e.columnName}>{e.columnName}</option>
                                      : null
                                  ))
                            }
                          </select>
                        </div>
                      </th>
                    </tr>
                    <tr>
                      <td>{contentPreview[keyName][0]}</td>
                    </tr>
                    <tr>
                      <td>{contentPreview[keyName][1]}</td>
                    </tr>
                    <tr>
                      <td>{contentPreview[keyName][2]}</td>
                    </tr>
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
