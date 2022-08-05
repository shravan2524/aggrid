import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import { ColDef, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { useWindowDimensions } from 'app/hooks';
import {
  FoldersContent,
  getFilterInFolderData,
  removeFilterInFolderData,
} from 'services/FolderAPIService';
import { agGridDateFormatter } from 'app/utils/Helpers';
import toast from 'react-hot-toast';

interface AGGridType {
  createdAt?: string;
  updatedAt?: string;
  id: number;
  title: string;
  modelName?: string;
}

function agGridDTO(rows: Array<FoldersContent>): Array<AGGridType> {
  return rows.map((item: FoldersContent) => ({
    id: item.id || -1,
    title: item?.filters?.title || '',
    modelName: item?.filters?.modelName,
    createdAt: item.createdAt,
    filterId: item.filterId,
  }));
}

type ActionsRendererProps = {
  params: ICellRendererParams;
  onDeleteClickCallback: (params: ICellRendererParams) => void;
};

function ActionsRenderer({
  params,
  onDeleteClickCallback,
}: ActionsRendererProps) {
  return (
    <div className="d-flex justify-content-around align-items-center w-100 h-100">
      <button
        type="button"
        onClick={() => onDeleteClickCallback(params)}
        className="btn btn-sm btn-danger"
      >
        Remove
      </button>
    </div>
  );
}

function ClickableStatusBarComponent(props: any, onBtExport) {
  return (
    <div className="ag-status-name-value d-flex gap-4">
      <button
        onClick={onBtExport}
        className="btn btn-outline-success btn-sm"
        type="button"
      >
        <i className="fas fa-sign-out-alt" />
        {' '}
        Export to Excel
      </button>
    </div>
  );
}

// main Function
export default function FolderFiltersDetailCellRenderer({
  data,
  node,
  api,
}: ICellRendererParams) {
  const gridRef = useRef<any>();
  const gridStyle = useMemo(() => ({ height: '600px', width: '90%' }), []);
  const [rowData, setRowData] = useState<any>();
  const { height, width } = useWindowDimensions();
  // default Columns settings

  const onfetchData = () => {
    getFilterInFolderData(data?.id).then((twoAData) => {
      setRowData(agGridDTO(twoAData));
    });
  };

  const onDeleteClickCallback = useCallback((params) => {
    if (data?.id) {
      removeFilterInFolderData({
        id: Number(data?.id),
        filterId: Number(params.data?.filterId),
      }).then(() => {
        toast.success('File Removed in Folder');
        onfetchData();
      });
    }
  }, []);

  const ActionsRendererCb = useCallback(
    (params) => (
      <ActionsRenderer
        params={params}
        onDeleteClickCallback={onDeleteClickCallback}
      />
    ),
    [],
  );

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: 'File Name',
      field: 'title',
      filter: 'agTextColumnFilter',
      editable: false,
      cellRenderer: 'agGroupCellRenderer',
    },
    {
      headerName: 'Model Name',
      field: 'modelName',
      filter: 'agTextColumnFilter',
      editable: false,
    },
    {
      headerName: 'Created On',
      field: 'createdAt',
      filter: 'agTextColumnFilter',
      valueGetter: (params) => agGridDateFormatter(params.data?.createdAt),
      editable: false,
    },
    {
      field: 'actions',
      cellRenderer: ActionsRendererCb,
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
  ]);
  const defaultColDef = useMemo<ColDef>(
    () => ({
      flex: 1,
      minWidth: 250,
      sortable: true,
      filter: true,
      floatingFilter: true,
      enableRowGroup: true,
      enableValue: true,
    }),
    [],
  );

  // rows
  const onGridReady = useCallback(
    (params: GridReadyEvent) => {
      onfetchData();
    },
    [data],
  );

  // export button
  const onBtExport = useCallback(() => {
    gridRef.current!.api.exportDataAsExcel({
      author: 'Finkraft',
      fontSize: 13,
      sheetName: 'Finkraft',
      fileName: 'finkraft-datas.xlsx',
    });
  }, []);

  const statusBar = useMemo(
    () => ({
      statusPanels: [
        {
          statusPanel: (pr) => ClickableStatusBarComponent(pr, onBtExport),
        },
      ],
    }),
    [],
  );

  const onFirstDataRendered = useCallback(() => {
    gridRef.current?.api.sizeColumnsToFit();
  }, []);

  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current?.api.sizeColumnsToFit();
    }
  }, [width, height]);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <div style={gridStyle} className="ag-theme-alpine py-2">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          groupDisplayType="multipleColumns"
          rowGroupPanelShow="always"
          paginationPageSize={10}
          statusBar={statusBar}
          masterDetail
          detailRowHeight={200}
          onFirstDataRendered={onFirstDataRendered}
          pagination
        />
      </div>
    </div>
  );
}
