import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { downloadZip } from 'client-zip';
import { toast } from 'react-hot-toast';
import { Button } from 'react-bootstrap';
import { AgGridReact } from 'ag-grid-react';
import { useAppDispatch, useWindowDimensions } from 'app/hooks';
import PageWrapper from 'components/PageWrapper';
import { agGridFilesDTO } from 'app/utils/Helpers';
import { BACKEND_API } from 'app/config';
import ReactFileUploder from 'components/FileUploder/Main';
import {
  GetContextMenuItemsParams,
  ICellRendererParams,
  MenuItemDef,
} from 'ag-grid-community';
import ColumnMapping from 'components/ColumnMapping/ColumnMapping';
import './FilePage.scss';
import { useSelector } from 'react-redux';
import { tenantUuid } from 'state/tenants/helper';
import {
  fetchFiles,
  getFiles,
  isLoadingSelector,
  setContentTypeRequest,
} from 'state/files/filesSlice';
import classNames from 'classnames';
import { AggridPagination } from 'components/AggridPagination';
import DetailCellRenderer from './Sub-Ag-Grid';
import CommentsPage from '../comments/CommentsPage';
import EditFilesTypeModal from './EditFilesTypeModal';
import { showModal } from '../../../../app/utils/Modal';

type ActionsRendererProps = {
  params: ICellRendererParams;
  onFileMappingClickCallback: (
    e: React.MouseEvent<HTMLButtonElement>,
    params: ICellRendererParams
  ) => void;
};
type SelectActionsRendererProps = {
  params: ICellRendererParams;
  onFileMappingClickCallback: (
    e: React.MouseEvent<HTMLButtonElement>,
    params: ICellRendererParams
  ) => void;
};

function SelectFiles({
  params,
  onFileMappingClickCallback,
}: SelectActionsRendererProps) {
  return (
    <div>
      <input
        type="checkbox"
        onChange={(e) => onFileMappingClickCallback(params.data.id, params)}
      />
      <label> </label>
    </div>
  );
}

function ActionsRenderer({
  params,
  onFileMappingClickCallback,
}: ActionsRendererProps) {
  if (!params.data) {
    return null;
  }

  const [contentType, setcontentType] = useState(params?.data?.fileType || '');
  const dispatch = useAppDispatch();

  // console.log('params', params);
  function onchange(e) {
    setcontentType(e.target.value);
    /* eslint-disable-next-line */
    dispatch(
      setContentTypeRequest({
        id: params.data.id,
        data: { fileType: e.target.value },
      }),
    );
  }

  const downloadFile = (fileId) => {
    const options: RequestInit = {
      method: 'GET',
      credentials: 'include',
    };
    const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/files/${fileId}/download`;
    fetch(apiUrl, options)
      .then((response) => response.json())
      .then((d) => {
        const url = d?.url || d;
        window.location.href = url;
      });
  };

  return (
    <div
      className="d-flex justify-content-between align-items-center w-100 h-100"
      id="columns"
    >
      <select className="p-8" onChange={onchange} value={contentType}>
        <option disabled value="">
          Select Content Type
        </option>
        <option value="2A">GSTR2A</option>
        <option value="2B">GSTR2B</option>
        <option value="PR">Purchase Register</option>
        <option value="InvoicePDF">Invoice PDF</option>
      </select>
      {params.data
      && (params.data.fileType === '2A'
      || params.data.fileType === '2B'
      || params.data.fileType === 'PR') ? (
        <ColumnMapping id={params.data.id} fileType={params.data.fileType} />
      ) : (
        <Button style={{ visibility: 'hidden' }} variant="primary">
          Column Mapping
        </Button>
      )}
      <button
        type="button"
        onClick={() => downloadFile(params.data.id)}
        className="btn btn-success"
      >
        <i className="fa fa-download" />
      </button>
      <CommentsPage fileId={params.data.id} />
    </div>
  );
}

function CustomActionsToolPanel(
  onRefreshCallback,
  selectedFiles,
  isFetchLoading,
  len,
) {
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false);
  // TODO: This code needs some refactoring work ...
  async function downloadTestZip(selFiles: any[]) {
    if (selFiles.length === 0) {
      toast.error('Select At least 1 File to download');
    } else {
      const promises: any = [];
      setDownloadLoading(true);
      // eslint-disable-next-line react/destructuring-assignment
      await selFiles.forEach((e) => {
        const newPromise = new Promise((resolve, reject) => {
          const options: RequestInit = {
            method: 'GET',
            credentials: 'include',
          };
          const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/files/${e}/download`;
          fetch(apiUrl, options)
            .then((response) => response.json())
            .then(async (data1) => {
              resolve(data1.url);
            });
        });
        promises.push(newPromise);
      });

      let urls: any = [];
      await Promise.all(promises).then(async (values: any) => {
        urls = values;
      });

      if (urls) {
        const urlsContentsPromise: any = [];
        urls.forEach((i) => {
          const np = new Promise((resolve, reject) => {
            fetch(i).then(async (response) => {
              resolve(response);
            });
          });
          urlsContentsPromise.push(np);
        });

        await Promise.all(urlsContentsPromise).then(async (v: any) => {
          const link = document.createElement('a');
          const blob = await downloadZip(v).blob();
          link.href = URL.createObjectURL(blob);
          link.download = 'files.zip';
          link.click();
          link.remove();
          setDownloadLoading(false);
        });
      } else {
        setDownloadLoading(false);
      }
    }
  }
  function editModal() {
    console.log(selectedFiles, len);
    if (len > 0) {
      showModal('editFilesTypeModal');
    } else {
      toast.error('please select atleast a single file');
    }
  }
  return (
    <div className="col">
      <div className="row p-2 gap-2 m-1">
        <button
          type="button"
          className="btn btn-sm btn-primary d-flex gap-1 align-items-center justify-content-center flex-wrap"
          onClick={editModal}
        >
          <i className="fa-solid fa-file-pen" />
          Edit File Type
        </button>
        <ReactFileUploder />
        <button
          type="button"
          className="btn btn-sm d-flex gap-1 align-items-center justify-content-center flex-wrap refreshBtn"
          onClick={onRefreshCallback}
        >
          <i
            className={classNames([
              'fa-solid',
              'fa-rotate',
              { 'fa-spin': isFetchLoading },
            ])}
          />
          Refresh
        </button>
        {/* {selectedFiles.length !== 0 && ( */}
        <button
          type="button"
          disabled={downloadLoading}
          className="btn btn-sm btn-warning d-flex gap-1 align-items-center justify-content-center flex-wrap"
          onClick={() => downloadTestZip(selectedFiles)}
        >
          {downloadLoading ? (
            <i className="fas fa-circle-notch fa-spin" />
          ) : (
            <i className="fa fa-download" />
          )}
          Download Files
        </button>
        {/* )
        } */}
      </div>
    </div>
  );
}

export default function FilesPage() {
  const dispatch = useAppDispatch();
  const gridRef = useRef<any>();
  const [totalPages, setTotalPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowData, setRowData] = useState<any>();
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const { height, width } = useWindowDimensions();
  const rows = useSelector(getFiles);
  const isFetchLoading = useSelector(isLoadingSelector);
  const [len, setlen] = useState(0);

  const containerStyle = useMemo(
    () => ({ width: '100%', height: '61vh' }),
    [],
  );
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

  const [selectedFiles, setselectedFiles] = useState<any[]>([]);
  const onFileMappingClickCallback = (e, params) => {
    const tselectfiles = selectedFiles;
    const ind = tselectfiles.findIndex((v) => v === e);
    if (ind === -1) {
      tselectfiles.push(e);
    } else {
      tselectfiles.splice(ind, 1);
    }
    setselectedFiles(tselectfiles);
    setlen(selectedRows.length);
  };

  const OnExpand = (i: any) => {
    i.node.setExpanded(!i.node.expanded);
  };

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: 'Files Details',
      children: [
        {
          field: '',
          // eslint-disable-next-line react/no-unstable-nested-components
          cellRenderer: (params) => (
            <div aria-hidden="true" onClick={() => OnExpand(params)}>
              <i className="fas fa-angle-right" />
            </div>
          ),
          editable: false,
          filter: false,
          width: 40,
          minWidth: 40,
          maxWidth: 40,
        },
        {
          field: '',
          // eslint-disable-next-line react/no-unstable-nested-components
          cellRenderer: (params) => (
            <SelectFiles
              params={params}
              onFileMappingClickCallback={(e) => onFileMappingClickCallback(e, params)}
            />
          ),
          editable: false,
          filter: false,
          groupDefaultExpanded: 1,
          masterDetail: true,
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
          filter: 'agTextColumnFilter',
          editable: false,
        },
        {
          headerName: 'Type',
          field: 'fileType',
          filter: 'agTextColumnFilter',
          editable: false,
          width: 120,
          minWidth: 120,
          maxWidth: 120,
        },
        {
          field: 'actions',
          // eslint-disable-next-line react/no-unstable-nested-components
          cellRenderer: (params) => (
            <ActionsRenderer
              params={params}
              onFileMappingClickCallback={(e) => onFileMappingClickCallback(e, params)}
            />
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

  const icons = useMemo<{ [key: string]: Function | string }>(
    () => ({
      'custom-actions-tool': '<i class="fa-solid fa-screwdriver-wrench"></i>',
    }),
    [],
  );

  const onRefreshCallback = () => {
    dispatch(fetchFiles());
  };

  useEffect(() => {
    setlen(selectedRows.length);
  }, []);

  const sideBar = useMemo(
    () => ({
      toolPanels: [
        {
          id: 'customActionsTool',
          labelDefault: 'Actions',
          labelKey: 'customActionsTool',
          iconKey: 'custom-actions-tool',
          toolPanel: () => CustomActionsToolPanel(onRefreshCallback, selectedFiles, isFetchLoading, len),
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
    }),
    [isFetchLoading],
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      floatingFilter: true,
      enableRowGroup: true,
      editable: true,
      enablePivot: true,
      enableValue: true,
    }),
    [],
  );

  const onFirstDataRendered = useCallback(() => {
    gridRef.current?.api.sizeColumnsToFit();
  }, []);

  const onGridReady = useCallback((params) => {
    dispatch(fetchFiles());
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

  const getContextMenuItems = useCallback(
    (params: GetContextMenuItemsParams): (string | MenuItemDef)[] => [
      {
        // custom item
        name: 'Edit Files type',
        action: () => {
          if (selectedRows.length) {
            console.log(selectedRows);
            showModal('editFilesTypeModal');
          } else {
            toast.error('You need to select at less one row.');
          }
        },
        icon: '<i class="fa-solid fa-file-pen" />',
      },
      'copy',
      'separator',
      'chartRange',
    ],
    [selectedRows],
  );

  // SUB AG-GRID
  const detailCellRenderer = useMemo<any>(() => DetailCellRenderer, []);

  // Effects ...
  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current?.api.sizeColumnsToFit();
    }
  }, [width, rows, selectedFiles]);

  useEffect(() => {
    setRowData(agGridFilesDTO(rows));

    if (gridRef.current?.api) {
      gridRef.current?.api.sizeColumnsToFit();
    }
  }, [rows]);

  // navigation
  const onPaginationChanged = () => {
    if (gridRef.current!.api!) {
      setCurrentPage(gridRef.current!.api.paginationGetCurrentPage() + 1);
      setTotalPage(gridRef.current!.api.paginationGetTotalPages());
    }
  };

  return (
    <PageWrapper pageTitle="Files" icon="fa-solid fa-file-arrow-up">
      <div style={containerStyle}>
        <EditFilesTypeModal selectedRows={selectedRows} />
        <div style={gridStyle} className="ag-theme-alpine">
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            masterDetail
            detailCellRenderer={detailCellRenderer}
            detailRowHeight={600}
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
            paginationPageSize={10}
            pagination
            suppressPaginationPanel
            suppressScrollOnNewData
            onPaginationChanged={onPaginationChanged}
            enableRangeSelection
            onFirstDataRendered={onFirstDataRendered}
            getContextMenuItems={getContextMenuItems}
            onSelectionChanged={onSelectionChanged}
          />
          <AggridPagination
            gridRef={gridRef}
            totalPages={totalPages}
            currentPage={currentPage}
          />
        </div>
      </div>
    </PageWrapper>
  );
}
