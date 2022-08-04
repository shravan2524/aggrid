import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import { agGridDateFormatter } from 'app/utils/Helpers';
import { useWindowDimensions } from 'app/hooks';
import { ICellRendererParams } from 'ag-grid-community';
import {
  deleteFilterData,
  fetchFilterData,
  Filters,
} from 'services/filtersAPIService';
import ShareDataModal from 'components/Library/SharePopup';
import { onModalHidden, showModal } from 'app/utils/Modal';
import toast from 'react-hot-toast';
import MyLibraryDetailCellRenderer from './MyLibrarySub';

type ActionsRendererProps = {
  params: ICellRendererParams;
  onDeleteFilter: (params: ICellRendererParams) => void;
  onShareClickCallback: (params: ICellRendererParams) => void;
};

function ActionsRenderer({
  params,
  onDeleteFilter,
  onShareClickCallback,
}: ActionsRendererProps) {
  return (
    <div className="d-flex justify-content-around align-items-center w-100 h-100">
      <button type="button" className="btn btn-sm btn-light">
        <i className="fa-solid fa-pen-to-square" />
      </button>
      <button
        onClick={(e) => onShareClickCallback(params)}
        type="button"
        className="btn btn-sm btn-light"
      >
        <i className="fas fa-user-plus" />
      </button>
      <button
        onClick={(e) => onDeleteFilter(params)}
        type="button"
        className="btn btn-sm btn-danger"
      >
        <i className="fas fa-trash" />
      </button>
      <button type="button" className="btn btn-sm btn-primary">
        <i className="fas fa-angle-double-right" />
        {' '}
        Move
      </button>
    </div>
  );
}

export default function MyFilters() {
  const gridRef = useRef<any>();
  const { height, width } = useWindowDimensions();
  const [itemData, setItemData] = useState<Filters | null>(null);

  const containerStyle = useMemo(
    () => ({ width: '100%', height: '100vh' }),
    [],
  );
  const gridStyle = useMemo(() => ({ height: '600px', width: '100%' }), []);
  const [rowData, setRowData] = useState<any>();

  const onfetchData = () => {
    fetchFilterData().then((twoAData) => {
      setRowData(twoAData);
    });
  };

  const onShareClickCallback = useCallback((params) => {
    setItemData(params.data);
    showModal('shareDataModal');
  }, []);

  const onDeleteFilter = useCallback((params) => {
    if (window.confirm(`${params.data?.title} File Will be deleted`)) {
      deleteFilterData({ id: params.data?.id }).then(() => {
        toast.success('File Deleted');
        onfetchData();
      });
    }
  }, []);

  const onModalHide = useCallback(() => {
    onModalHidden('shareDataModal', () => {
      setItemData(null);
      onfetchData();
    });
  }, []);

  const OnExpand = (i: any) => {
    i.node.setExpanded(!i.node.expanded);
  };

  const [columnDefs, setColumnDefs] = useState([
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
      headerName: 'Name',
      field: 'title',
      filter: 'agTextColumnFilter',
      editable: false,
    },
    {
      headerName: 'Model Name',
      field: 'modelName',
      filter: 'agTextColumnFilter',
      editable: false,
    },
    {
      headerName: 'Create On',
      field: 'createdAt',
      filter: 'agTextColumnFilter',
      valueGetter: (params) => agGridDateFormatter(params.data?.updatedAt),
      editable: false,
    },
    {
      headerName: 'Updated On',
      field: 'updatedAt',
      filter: 'agTextColumnFilter',
      valueGetter: (params) => agGridDateFormatter(params.data?.updatedAt),
      editable: false,
    },
    {
      field: 'actions',
      // eslint-disable-next-line react/no-unstable-nested-components
      cellRenderer: (params) => (
        <ActionsRenderer
          params={params}
          onDeleteFilter={onDeleteFilter}
          onShareClickCallback={onShareClickCallback}
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
  ]);

  // SIDE BAR
  const sideBar = useMemo(
    () => ({
      toolPanels: [
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
    }),
    [],
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

  const onGridReady = useCallback((params) => {
    onfetchData();
    onModalHide();
  }, []);

  const onFirstDataRendered = useCallback(() => {
    gridRef.current?.api.sizeColumnsToFit();
  }, []);

  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current?.api.sizeColumnsToFit();
    }
  }, [width, rowData, height]);

  // SUB AG-GRID
  const detailCellRenderer = useMemo<any>(
    () => MyLibraryDetailCellRenderer,
    [],
  );

  return (
    <div style={containerStyle}>
      <ShareDataModal itemData={itemData} shared={false} />
      <div style={gridStyle} className="ag-theme-alpine">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          sideBar={sideBar}
          rowSelection="multiple"
          rowDragManaged
          rowDragMultiRow
          rowGroupPanelShow="always"
          defaultColDef={defaultColDef}
          enableCharts
          groupDisplayType="multipleColumns"
          animateRows
          onGridReady={onGridReady}
          onFirstDataRendered={onFirstDataRendered}
          pagination
          masterDetail
          detailCellRenderer={detailCellRenderer}
          detailRowHeight={600}
          paginationPageSize={10}
        />
      </div>
    </div>
  );
}
