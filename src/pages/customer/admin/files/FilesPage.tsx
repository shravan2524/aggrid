import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import { showModal } from 'app/utils/Modal';
import { useAppDispatch, useWindowDimensions } from 'app/hooks';
import PageWrapper from 'components/PageWrapper';
import CustomButton from 'components/CustomButton';
import { agGridFilesDTO } from 'app/utils/Helpers';

import ReactFileUploder from 'components/FileUploder/Main';
import { Column, Downloader, ICellRendererParams } from 'ag-grid-community';
import ColumnMapping from 'components/ColumnMapping/ColumnMapping';
import './FilePage.scss';
import { useSelector } from 'react-redux';
import {
  fetchFiles, getFiles,
  setContentTypeRequest, setColumnMappingRequest,
} from 'state/files/filesSlice';

type ActionsRendererProps = {
  params: ICellRendererParams;
  onFileMappingClickCallback: (e: React.MouseEvent<HTMLButtonElement>, params: ICellRendererParams) => void;
};
type SelectActionsRendererProps = {
  params: ICellRendererParams;
  onFileMappingClickCallback: (e: React.MouseEvent<HTMLButtonElement>, params: ICellRendererParams) => void;
};
function SelectFiles({ params, onFileMappingClickCallback } : SelectActionsRendererProps) {
  // console.log(params.data);
  return (
    <div>
      <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" onChange={(e) => onFileMappingClickCallback(params.data.id, params)} />
      <label> </label>
    </div>
  );
}

function ActionsRenderer({ params, onFileMappingClickCallback }: ActionsRendererProps) {
  const [contentType, setcontentType] = useState('GSTR2A');
  const dispatch = useAppDispatch();
  // console.log('params', params);
  function onchange(e) {
    setcontentType(e.target.value);
    /* eslint-disable-next-line */
    dispatch(setContentTypeRequest({ ...params.data, data: e.target.value }));
  }

  const download = (e) => {
    console.log('download file');
  };
  return (
    <div className="d-flex justify-content-between align-items-center w-100 h-100" id="columns">
      <select className="p-8" onChange={onchange}>
        <option selected disabled>Select Content Type </option>
        {
          (params.data) && (params.data.fileType === '2A')
            ? <option selected value="2A">GSTR2A</option>
            : <option>GSTR2A</option>
        }
        {
          (params.data) && (params.data.fileType === '2B')
            ? <option selected value="2B">GSTR2B</option>
            : <option>GSTR2B</option>
        }
        {
          (params.data) && (params.data.fileType === 'PR')
            ? <option selected value="PR">Purchase Register</option>
            : <option>Purchase Register</option>
        }
        <option>Invoice PDF</option>
      </select>
      {
        (params.data)
        && (params.data.fileType === '2A' || params.data.fileType === '2B' || params.data.fileType === 'PR')
          ? (
            <ColumnMapping id={params.data.id} fileType={params.data.fileType} />
          )
          : null
      }
      <button
        type="button"
        className="btn btn-sm btn-info px-4 d-flex gap-2 align-items-center justify-content-center"
        onClick={download}
      >
        <i className="fa fa-download" />
        Download File
      </button>
    </div>
  );
}

function CustomActionsToolPanel(onRefreshCallback) {
  return (
    <div className="container-fluid">
      <div className="row p-2 gap-2">
        <ReactFileUploder />

        <button
          type="button"
          className="btn btn-sm btn-info px-4 d-flex gap-2 align-items-center justify-content-center"
          onClick={onRefreshCallback}
        >
          <i className="fa-solid fa-rotate" />
          Refresh
        </button>
        <button
          type="button"
          className="btn btn-sm btn-info px-4 d-flex gap-2 align-items-center justify-content-center"
          onClick={onRefreshCallback}
        >
          <i className="fa fa-download" />
          Download Files
        </button>
      </div>
    </div>
  );
}

export default function FilesPage() {
  const dispatch = useAppDispatch();
  const gridRef = useRef<any>();

  const [rowData, setRowData] = useState<any>();
  const { height, width } = useWindowDimensions();
  const rows = useSelector(getFiles);

  const containerStyle = useMemo(() => ({
    width: '100%',
    height: '25rem',
  }), [height, width]);

  const [selectedFiles, setselectedFiles] = useState<any[]>([]);
  const onFileMappingClickCallback = (e, params) => {
    // console.log('Do Mapping or something like show a modal etc here ...');
    const tselectfiles = selectedFiles;
    const ind = tselectfiles.findIndex((v) => v === e);
    console.log(ind);
    if (ind === -1) {
      tselectfiles.push(e);
    } else {
      tselectfiles.splice(ind, 1);
    }
    setselectedFiles(tselectfiles);
    console.log(selectedFiles);
  };

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: 'Files Details',
      children: [
        {
          field: '',
          // eslint-disable-next-line react/no-unstable-nested-components
          cellRenderer: (params) => (<SelectFiles params={params} onFileMappingClickCallback={(e) => onFileMappingClickCallback(e, params)} />),
          editable: false,
          filter: false,
          cellStyle: (params) => {
            if (params.value === 'Actions') {
              // mark police cells as red
              return { width: '100%', height: '100%' };
            }
            return null;
          },
          width: 40,
          minWidth: 40,
          maxWidth: 40,
        },
        {
          headerName: 'Name',
          field: 'fileName',
          filter: 'agNumberColumnFilter',
          editable: false,
        },
        {
          field: 'actions',
          // eslint-disable-next-line react/no-unstable-nested-components
          cellRenderer: (params) => (<ActionsRenderer params={params} onFileMappingClickCallback={(e) => onFileMappingClickCallback(e, params)} />),
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
    dispatch(fetchFiles());
  };

  const sideBar = useMemo(() => ({
    toolPanels: [
      {
        id: 'customActionsTool',
        labelDefault: 'Actions',
        labelKey: 'customActionsTool',
        iconKey: 'custom-actions-tool',
        toolPanel: () => CustomActionsToolPanel(onRefreshCallback),
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
  }), []);

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
    dispatch(fetchFiles());
  }, []);

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
    <PageWrapper pageTitle="Files" icon="fa-solid fa-file-arrow-up">
      <div className="ag-theme-alpine grid-container-style">
        <AgGridReact
          containerStyle={containerStyle}
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
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
          groupIncludeFooter
          groupIncludeTotalFooter
          enableRangeSelection
          masterDetail
        />
      </div>
    </PageWrapper>
  );
}
