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
import PageWrapper from 'components/PageWrapper';
import EditFilterPopup from 'components/Library/OnEditFilter';
import MoveFilterPopup from 'components/Library/MoveFilter';
import MyLibraryDetailCellRenderer from './MyLibrarySub';

type ActionsRendererProps = {
  params: ICellRendererParams;
  onDeleteFilter: (params: ICellRendererParams) => void;
  onShareClickCallback: (params: ICellRendererParams) => void;
  onEditClickCallback: (params: ICellRendererParams) => void;
  onMoveClickCallback: (params: ICellRendererParams) => void;
};

function ActionsRenderer({
  params,
  onDeleteFilter,
  onShareClickCallback,
  onEditClickCallback,
  onMoveClickCallback,
}: ActionsRendererProps) {
  return (
    <div className="d-flex justify-content-around align-items-center w-100 h-100">
      <button
        onClick={(e) => onEditClickCallback(params)}
        type="button"
        className="btn btn-sm btn-light"
      >
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
      <button
        onClick={(e) => onMoveClickCallback(params)}
        type="button"
        className="btn btn-sm btn-primary"
      >
        <i className="fas fa-angle-double-right" />
        {' '}
        Move
      </button>
    </div>
  );
}

const moduleTitle = 'My Library';

function MyLibraryPage() {
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

  const onEditClickCallback = useCallback((params) => {
    setItemData(params.data);
    showModal('editFilterPopup');
  }, []);

  const onMoveClickCallback = useCallback((params) => {
    setItemData(params.data);
    showModal('moveFilterPopup');
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
      headerName: 'Create On',
      field: 'createdAt',
      filter: 'agTextColumnFilter',
      valueGetter: (params) => agGridDateFormatter(params.data?.createdAt),
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
          onEditClickCallback={onEditClickCallback}
          onMoveClickCallback={onMoveClickCallback}
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
    <PageWrapper pageTitle={moduleTitle} icon="fas fa-folder-open">
      <div style={containerStyle}>
        <MoveFilterPopup params={itemData} />
        <EditFilterPopup editFilter={itemData} onfetchData={onfetchData} />
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
    </PageWrapper>
  );
}
export default React.memo(MyLibraryPage);
