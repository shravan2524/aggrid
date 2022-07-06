import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { toast } from 'react-hot-toast';
import { Button, Modal } from 'react-bootstrap';
import { AgGridReact } from 'ag-grid-react';
import { useAppDispatch, useWindowDimensions } from 'app/hooks';
import PageWrapper from 'components/PageWrapper';
import { agGridFilesDTO } from 'app/utils/Helpers';
import { BACKEND_API } from 'app/config';
import {
  GetContextMenuItemsParams,
  MenuItemDef,
} from 'ag-grid-community';
import { useSelector } from 'react-redux';
import { tenantUuid } from 'state/tenants/helper';
import {
  fetchFiles, getFiles, isLoadingSelector,
} from 'state/files/filesSlice';
import classNames from 'classnames';
import DetailCellRenderer from '../files/Sub-Ag-Grid';

interface Type {
  btnName: string;
}

function Container1({ btnName }: Type) {
  const [show, setShow] = useState(false);
  const handleShow = () => {
    setShow(true);
  };
  const handleClose = () => setShow(false);
  const [colgroup, setcolgroup] = useState('');
  const onSubmitAction = (e) => {
    const dt = {
      ColumnGroup: {
        title: '1',
        description: colgroup,
        createdBy: 1,
        parent: 1,
      },
    };
    console.log(dt);
    const options: RequestInit = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ dt }),
    };
    const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/columngroups/`;
    fetch(apiUrl, options)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  };
  return (
    <>
      <Button variant="primary" className="btn btn-sm btn-info px-4 d-flex gap-2 align-items-center justify-content-center" onClick={handleShow}>{btnName}</Button>
      <Modal show={show} onHide={handleClose} size="xl" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>{btnName}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="mapping">
          <div className="d-flex justify-content-center">
            <div className="d-flex w-50 justify-content-between p-3">
              <input type="text" className="w-75 px-5" onChange={(e) => setcolgroup(e.target.value)} value={colgroup} />
              <button type="button" className="btn btn-primary" onClick={(e) => onSubmitAction(e)}>Save</button>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function CustomActionsToolPanel(onRefreshCallback, isFetchLoading) {
  return (
    <div className="container-fluid">
      <div className="row p-2 gap-2">
        <Container1 btnName="Create Column Group" />
        <Container1 btnName="Update Column Group" />
        <button
          type="button"
          className="btn btn-sm btn-info px-4 d-flex gap-2 align-items-center justify-content-center"
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
  const [rowData, setRowData] = useState<any>();
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const { height, width } = useWindowDimensions();
  const rows = useSelector(getFiles);
  const isFetchLoading = useSelector(isLoadingSelector);

  const containerStyle = useMemo(
    () => ({ width: '100%', height: '100vh' }),
    [],
  );
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

  const [selectedFiles, setselectedFiles] = useState<any[]>([]);
  const [tmp, settmp] = useState<any[]>([]);

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: 'Column Grouping Details',
      children: [
        {
          headerName: 'Name',
          field: 'fileName',
          filter: 'agTextColumnFilter',
          editable: false,
        },
        {
          headerName: 'updated At',
          field: 'updated At',
          filter: 'agTextColumnFilter',
          editable: false,
        },
        {
          field: 'actions',
          // eslint-disable-next-line react/no-unstable-nested-components
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
    'custom-actions-tool': '<i class="fa-solid fa-screwdriver-wrench"></i>',
  }), []);

  const onRefreshCallback = () => {
  };

  const sideBar = useMemo(() => ({
    toolPanels: [
      {
        id: 'customActionsTool',
        labelDefault: 'Actions',
        labelKey: 'customActionsTool',
        iconKey: 'custom-actions-tool',
        toolPanel: () => CustomActionsToolPanel(onRefreshCallback, isFetchLoading),
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

  async function fetchFilesData() {
    const options: RequestInit = {
      method: 'GET',
      credentials: 'include',
    };
    const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/columngroups/`;
    // const apiUrl = 'https://beta.finkraft.ai/api/v1/f3b4a42c-9ac8-42c3-a5ff-1a6e6da8f5c0/columngroups/';
    const response = await fetch(apiUrl, options);
    if (!response.ok) {
      const message = `An error has occurreds: ${response.status}`;
      throw new Error(message);
    }
    console.log(response.json());
    return response.json();
  }
  const onGridReady = useCallback((params) => {
    fetchFilesData();
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
      icon: '<i class="fa-solid fa-file-pen" />',
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
    setRowData(agGridFilesDTO(rows));

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
