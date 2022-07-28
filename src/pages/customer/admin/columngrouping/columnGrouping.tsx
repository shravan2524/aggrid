import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { toast } from 'react-hot-toast';
import { Button, Modal } from 'react-bootstrap';
import { AgGridReact } from 'ag-grid-react';
import { useAppDispatch, useWindowDimensions } from 'app/hooks';
import PageWrapper from 'components/PageWrapper';
import { BACKEND_API } from 'app/config';
import classNames from 'classnames';
import {
  GetContextMenuItemsParams,
  MenuItemDef,
} from 'ag-grid-community';
import { useSelector } from 'react-redux';
import { tenantUuid } from 'state/tenants/helper';
import { getFiles, isLoadingSelector } from 'state/files/filesSlice';
import { agGridDateFormatter } from 'app/utils/Helpers';
import DetailCellRenderer from '../files/Sub-Ag-Grid';

const moduleName = 'Column';
const moduleTitle = 'Column';
const modalIdentifier = `save${moduleName}Modal`;

interface Type {
  btnName: string;
  sendFunc: Function;
}

interface AGGridType {
  id?: number,
  title?: string,
  createdAt?: Date,
  updatedAt?: Date,
}
interface ItemType {
  id?: number,
  title?: string,
  createdAt?: Date,
  updatedAt?: Date,
}
type ActionsRendererProps = {
  title: string;
  id: string;
  sendFunc:Function
};

function ActionsRenderer({ title, id, sendFunc }: ActionsRendererProps) {
  const [show, setShow] = useState(false);
  const [colgroup, setcolgroup] = useState(title);
  const handleShow = () => {
    setShow(true);
  };
  async function putData() {
    const options: RequestInit = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify({
        title: colgroup,
        description: '1',
        createdBy: 1,
        parent: 1,
      }),
    };
    const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/column-groups/${id}`;
    await fetch(apiUrl, options)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        toast.success('Column Group Updated');
      });
    await sendFunc();
  }

  const onSubmitAction = (e) => {
    e.preventDefault();
    setShow(false);
    putData();
  };
  const handleClose = () => setShow(false);
  return (
    <>
      <Button variant="primary" className="btn btn-sm btn-light" onClick={handleShow}>
        <i className="fa-solid fa-pen-to-square" />
        {' '}
        Edit
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Column Group</Modal.Title>
        </Modal.Header>
        <Modal.Body className="mapping">
          <div className="mb-3">
            <label className="col-form-label required" style={{ fontSize: '13px' }}>Column Group Name (*) </label>
            <input type="text" className={classNames(['form-control form-control-sm'])} onChange={(e) => setcolgroup(e.target.value)} value={colgroup} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className="btn btn-sm btn-danger" onClick={handleClose}>
            Close
          </Button>
          <button type="button" className="btn btn-sm btn-primary" onClick={(e) => onSubmitAction(e)}>Save</button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function agGridDTO(rows: Array<ItemType>): Array<AGGridType> {
  return rows.map(
    (item: ItemType) => ({
      id: item.id || -1,
      title: item?.title || '',
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }),
  );
}

function Container1({ btnName, sendFunc }: Type) {
  const [show, setShow] = useState(false);
  const [colgroup, setcolgroup] = useState('');
  const handleShow = () => {
    setShow(true);
    setcolgroup('');
  };
  const handleClose = () => {
    setShow(false);
  };
  async function getData() {
    const options: RequestInit = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        title: colgroup,
        description: '1',
        createdBy: 1,
        parent: 1,
      }),
    };
    const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/column-groups`;
    await fetch(apiUrl, options)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        toast.success('Column Group added');
      });
    await sendFunc();
  }
  const onSubmitAction = (e) => {
    e.preventDefault();
    setShow(false);
    getData();
  };
  const modalId = 'ColunGroup';
  return (
    <>
      <Button variant="primary" className="btn btn-sm btn-danger px-4 d-flex gap-2 align-items-center justify-content-center" onClick={handleShow}>
        <i className="fa-solid fa-circle-plus" />
        {' '}
        {btnName}
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <form onSubmit={onSubmitAction}>
          <Modal.Header closeButton>
            <Modal.Title>{btnName}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="mapping">
            <div className="mb-3">
              <label className="col-form-label" style={{ fontSize: '13px' }}>Column Group Name (*) </label>
              <input type="text" required className={classNames(['form-control form-control-sm'])} onChange={(e) => setcolgroup(e.target.value)} value={colgroup} />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" className="btn btn-sm btn-danger" onClick={handleClose}>
              Close
            </Button>
            <button type="submit" value="Submit" className="btn btn-sm btn-primary">Save</button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

function CustomActionsToolPanel(onRefreshCallback, isFetchLoading, sendFunc) {
  return (
    <div className="col">
      <div className="row p-2 gap-2 m-1">
        <Container1 btnName="Create Column Group" sendFunc={sendFunc} />
        <button
          type="button"
          className="btn btn-sm btn-info px-4 d-flex gap-2 align-items-center justify-content-center flex-wrap"
          onClick={onRefreshCallback}
        >
          <i className={classNames(['fa-solid', 'fa-rotate', { 'fa-spin': isFetchLoading }])} />
          Refresh
        </button>
      </div>
    </div>
  );
}

export default function columnGrouping() {
  const dispatch = useAppDispatch();
  const gridRef = useRef<any>();
  const [rowData, setRowData] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const { height, width } = useWindowDimensions();
  const rows = useSelector(getFiles);
  const isFetchLoading = useSelector(isLoadingSelector);

  const containerStyle = useMemo(
    () => ({ width: '100%', height: '100vh' }),
    [],
  );
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

  const sendFunc = () => {
    const options: RequestInit = {
      method: 'GET',
      credentials: 'include',
    };
    const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/column-groups`;
    fetch(apiUrl, options)
      .then((response) => response.json())
      .then((data) => {
        setRowData(data);
      });
  };

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: 'Column Grouping Details',
      children: [
        {
          headerName: 'Title',
          field: 'title',
          filter: 'agTextColumnFilter',
          editable: false,
        },
        {
          headerName: 'Created On',
          field: 'createdAt',
          filter: 'agTextColumnFilter',
          editable: false,
          valueGetter: (params) => (agGridDateFormatter(params.data?.createdAt)),
        },
        {
          headerName: 'Updated On',
          field: 'updatedAt',
          filter: 'agTextColumnFilter',
          editable: false,
          valueGetter: (params) => (agGridDateFormatter(params.data?.updatedAt)),
        },
        {
          field: 'actions',
          // eslint-disable-next-line react/no-unstable-nested-components
          cellRenderer: (params) => (
            <ActionsRenderer title={params.data.title} id={params.data.id} sendFunc={sendFunc} />
          ),
          editable: false,
          filter: false,
          cellStyle: (params) => {
            if (params.value === 'Actions') {
              // mark police cells as red
              return { width: '100%', height: '100%' };
            }
            return null;
          },
        },
      ],
    },
  ]);

  const icons = useMemo<{ [key: string]: Function | string; }>(() => ({
    'custom-actions-tool': '<i className="fa-solid fa-screwdriver-wrench"></i>',
  }), []);

  const onRefreshCallback = () => {
    sendFunc();
  };

  const sideBar = useMemo(() => ({
    toolPanels: [
      {
        id: 'customActionsTool',
        labelDefault: 'Actions',
        labelKey: 'customActionsTool',
        iconKey: 'custom-actions-tool',
        toolPanel: () => CustomActionsToolPanel(onRefreshCallback, isFetchLoading, sendFunc),
      },
      {
        id: 'columns',
        labelDefault: 'Columns',
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel',
      },
      {
        id: 'filters',
        labelDefault: 'Filters',
        labelKey: 'filters',
        iconKey: 'filter',
        toolPanel: 'agFiltersToolPanel',
      },
    ],
    defaultToolPanel: 'customActionsTool',
  }), [isFetchLoading]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: true,
    enableRowGroup: true,
    editable: true,
    enablePivot: true,
    enableValue: true,
  }), []);

  const onFirstDataRendered = useCallback(() => {
    gridRef.current?.api.sizeColumnsToFit();
  }, []);

  const onGridReady = useCallback((params) => {
    const options: RequestInit = {
      method: 'GET',
      credentials: 'include',
    };
    const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/column-groups`;
    fetch(apiUrl, options)
      .then((response) => response.json())
      .then((data) => {
        if (!data.error) {
          setRowData(data);
        }
      });
  }, []);

  // TODO : Implement row range selection ...
  const onSelectionChanged = useCallback(() => {
    const selRows = gridRef.current!.api.getSelectedRows();
    const selection: any = [];
    selRows.forEach((selectedRow, index) => {
      selection.push(selectedRow);
    });

    setSelectedRows(selection);
  }, []);

  const getContextMenuItems = useCallback((params: GetContextMenuItemsParams): (
    | string
    | MenuItemDef
  )[] => [
      {
        // custom item
        name: 'Edit Files type',
        action: () => {
          if (selectedRows.length) {
            // showModal('editFilesTypeModal');
          } else {
            toast.error('You need to select at less one row.');
          }
        },
        icon: '<i className="fa-solid fa-file-pen" />',
      },
      'copy',
      'separator',
      'chartRange',
    ], [selectedRows]);

  // SUB AG-GRID
  const detailCellRenderer = useMemo<any>(() => DetailCellRenderer, []);

  // Effects ...
  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current?.api.sizeColumnsToFit();
    }
  }, [width, rows]);

  useEffect(() => {
    setRowData(agGridDTO(rows));

    if (gridRef.current?.api) {
      gridRef.current?.api.sizeColumnsToFit();
    }
  }, [rows]);

  return (
    <PageWrapper pageTitle="Column Grouping" icon="fa-solid fa-object-group">
      <div style={containerStyle}>
        <div style={gridStyle} className="ag-theme-alpine">
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            masterDetail
            detailCellRenderer={detailCellRenderer}
            detailRowHeight={400}
            sideBar={sideBar}
            rowSelection="multiple"
            rowDragManaged
            rowDragMultiRow
            rowGroupPanelShow="always"
            defaultColDef={defaultColDef}
            groupDisplayType="multipleColumns"
            animateRows
            onGridReady={onGridReady}
            icons={icons}
            pagination
            onFirstDataRendered={onFirstDataRendered}
            getContextMenuItems={getContextMenuItems}
            onSelectionChanged={onSelectionChanged}
          />
        </div>
      </div>
    </PageWrapper>
  );
}
