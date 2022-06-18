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
import { columns2A, columns2B, columnsPR } from './DBColumns';

interface Type {
  id: string;
  fileType: string;
}

export default function ColumnMapping({ fileType, id }: Type) {
  const [test, settest] = useState(true);
  const [columnMapping, setColumnMapping] = useState({});
  const [cols, setCols] = useState({
    '2A': columns2A,
    '2B': columns2B,
    PR: columnsPR,
  });

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

  const setMapping = (k) => {
    const fn = (e) => {
      const columnName = e.target.value;
      const newColumnMapping = { ...columnMapping };
      newColumnMapping[k] = { columnName };
      // set the mapping
      setColumnMapping(newColumnMapping);
      console.log(newColumnMapping);
    };
    return fn;
  };

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
                  <table key={i} className="columnMapping">
                    <tbody>
                      <tr>
                        <th>
                          <div>
                            <span>{keyName}</span>
                            <select onChange={setMapping(keyName)} value={columnMapping[keyName]?.columnName}>
                              <option>-- select column --</option>
                              {
                                cols[fileType].map((e, idx) => (<option key={idx} value={e.columnName}>{e.columnTitle || e.columnName}</option>))
                              }
                            </select>
                          </div>
                        </th>
                      </tr>
                      <tr>
                        <td>{contentPreview[keyName][0] || ' '}</td>
                      </tr>
                      <tr>
                        <td>{contentPreview[keyName][1] || ' '}</td>
                      </tr>
                      <tr>
                        <td>{contentPreview[keyName][2] || ' '}</td>
                      </tr>
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
