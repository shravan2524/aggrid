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
        setcontentPreview(data1.contentPreview || {});
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
