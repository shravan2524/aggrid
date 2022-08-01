import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import { showModal } from 'app/utils/Modal';
import { useWindowDimensions } from 'app/hooks';
import PageWrapper from 'components/PageWrapper';
import { AggridPagination } from 'components/AggridPagination';
import ShareDataModal from 'components/Library/SharePopup';

const moduleName = 'Shared Data';

function CustomActionsToolPanel() {
  return (
    <div className="col">
      <div className="row p-2 gap-2 m-1">
        <button
          type="button"
          className="btn btn-sm btn-danger px-4 d-flex gap-2 align-items-center justify-content-center flex-wrap"
        >
          <i className="fas fa-rotate" />
          Refresh
        </button>
        <button
          type="button"
          className="btn btn-md btn-primary  px-4 d-flex gap-2 align-items-center justify-content-center flex-wrap"
          onClick={() => showModal('shareDataModal')}
        >
          <i className="fas fa-folder-plus" />
          Share Data
        </button>
      </div>
    </div>
  );
}

function SharedFilterView() {
  const gridRef = useRef<any>();
  const [rowData, setRowData] = useState<any>();
  const { height, width } = useWindowDimensions();
  const [totalPages, setTotalPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const containerStyle = useMemo(
    () => ({ width: '100%', height: '100vh' }),
    [],
  );
  const gridStyle = useMemo(() => ({ height: '600px', width: '100%' }), []);

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: `${moduleName} Details`,
      children: [
        {
          headerName: 'Title',
          field: 'title',
          filter: 'agTextColumnFilter',
        },
        {
          headerName: 'Policies',
          field: 'policies',
          filter: 'agTextColumnFilter',
          editable: false,
        },
        {
          headerName: 'Updated On',
          field: 'updatedAt',
          filter: 'agTextColumnFilter',
          editable: false,
        },
        {
          headerName: 'Data',
          field: 'data',
          filter: 'agTextColumnFilter',
        },
        {
          headerName: 'News',
          field: 'new',
          filter: 'agTextColumnFilter',
          editable: false,
        },
        {
          headerName: 'Created',
          field: 'created',
          filter: 'agTextColumnFilter',
          editable: false,
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

  const sideBar = useMemo(
    () => ({
      toolPanels: [
        {
          id: 'customActionsTool',
          labelDefault: 'Actions',
          labelKey: 'customActionsTool',
          iconKey: 'custom-actions-tool',
          toolPanel: () => CustomActionsToolPanel(),
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

  const onFirstDataRendered = useCallback(() => {
    gridRef.current?.api.sizeColumnsToFit();
  }, []);

  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current?.api.sizeColumnsToFit();
    }
  }, [width]);

  // navigation
  const onPaginationChanged = () => {
    if (gridRef.current!.api!) {
      setCurrentPage(gridRef.current!.api.paginationGetCurrentPage() + 1);
      setTotalPage(gridRef.current!.api.paginationGetTotalPages());
    }
  };

  return (
    <PageWrapper pageTitle={moduleName} icon="fas fa-folder">
      <div style={containerStyle}>
        <ShareDataModal active={false} shared={false} />
        <div style={gridStyle} className="ag-theme-alpine">
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            sideBar={sideBar}
            rowDragManaged
            rowDragMultiRow
            rowGroupPanelShow="always"
            defaultColDef={defaultColDef}
            groupDisplayType="multipleColumns"
            animateRows
            icons={icons}
            paginationPageSize={10}
            pagination
            suppressPaginationPanel
            suppressScrollOnNewData
            onPaginationChanged={onPaginationChanged}
            onFirstDataRendered={onFirstDataRendered}
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

export default React.memo(SharedFilterView);
