import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import { toast } from 'react-hot-toast';
import { showModal } from 'app/utils/Modal';
import { useAppDispatch, useWindowDimensions } from 'app/hooks';
import PageWrapper from 'components/PageWrapper';
import {
  fetchTenants,
  updateTenantRequest,
  getTenants,
  setSelectedTenant,
  getSelectedTenant,
} from 'state/tenants/tenantsSlice';
import { agGridTenantsDTO } from 'app/utils/Helpers';
import { TenantAGGridType, TenantType } from 'services/tenantsAPIService';
import { useSelector } from 'react-redux';
import { ICellRendererParams } from 'ag-grid-community';
import {
  setSelectedGstin,
  isLoadingSelector,
} from 'state/gstins/gstinsSlice';
import classNames from 'classnames';
import { AggridPagination } from 'components/AggridPagination';
import NewTenantModal from './NewTenantModal';
import EditTenantModal from './EditTenantModal';

type ActionsRendererProps = {
  params: ICellRendererParams;
  onEditClickCallback: (
    e: React.MouseEvent<HTMLButtonElement>,
    params: ICellRendererParams
  ) => void;
  onSelectClickCallback: (
    e: React.MouseEvent<HTMLButtonElement>,
    params: ICellRendererParams
  ) => void;
};
function ActionsRenderer({
  params,
  onEditClickCallback,
  onSelectClickCallback,
}: ActionsRendererProps) {
  const activeTenant = useSelector(getSelectedTenant);
  return (
    <div className="d-flex btn-group align-items-center w-100 h-100">
      <button
        type="button"
        className="btn btn-sm btn-primary"
        onClick={(e) => onEditClickCallback(e, params)}
      >
        <i className="fa-solid fa-pen-to-square" />
        {' '}
        Edit
      </button>
      {activeTenant?.id !== params.data?.id ? (
        <button
          type="button"
          className="btn btn-sm btn-light"
          onClick={(e) => onSelectClickCallback(e, params)}
        >
          <i className="fa-solid fa-circle-check" />
          {' '}
          Select
        </button>
      ) : (
        <button type="button" className="btn btn-sm btn-light text-success">
          <i className="fa-solid fa-circle-check" />
          {' '}
          Active
        </button>
      )}
    </div>
  );
}

function CustomActionsToolPanel(onRefreshCallback, isFetchLoading) {
  return (
    <div className="col">
      <div className="row p-2 gap-2 m-1">
        <button
          type="button"
          className="btn btn-sm btn-success px-4 d-flex gap-2 align-items-center justify-content-center flex-wrap"
          onClick={() => showModal('newTenantModal')}
        >
          <i className="fa-solid fa-circle-plus" />
          Add New Workspace
        </button>
        <button
          type="button"
          className="btn btn-sm btn-info px-4 d-flex gap-2 align-items-center justify-content-center flex-wrap refreshBtn"
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
      </div>
    </div>
  );
}

export default function WorkspacesPage() {
  const dispatch = useAppDispatch();
  const gridRef = useRef<any>();
  const rows = useSelector(getTenants);
  const selectedWorkspace = useSelector(getSelectedTenant);
  const [tenantToEdit, setTenantToEdit] = useState<TenantType | null>(null);
  const isFetchLoading = useSelector(isLoadingSelector);
  const { width } = useWindowDimensions();
  const [rowData, setRowData] = useState<TenantAGGridType[]>([]);
  const [totalPages, setTotalPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const containerStyle = useMemo(
    () => ({ width: '100%', height: '100vh' }),
    [],
  );
  const gridStyle = useMemo(() => ({ height: '500px', width: '100%' }), []);

  const onEditClickCallback = (e, params) => {
    setTenantToEdit(params.data);
    showModal('editTenantModal');
  };

  const onSelectClickCallback = (e, params) => {
    // console.log(selectedWorkspace);
    if (params.data) {
      if (params.data.id) {
        dispatch(setSelectedGstin(null));
        dispatch(setSelectedTenant(params.data.id));
      }
    }
  };

  const onRefreshCallback = () => {
    dispatch(fetchTenants());
  };

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: 'Tenants Details',
      children: [
        {
          headerName: 'ID',
          field: 'id',
          filter: 'agNumberColumnFilter',
          editable: false,
        },
        {
          headerName: 'Title',
          field: 'title',
          filter: 'agTextColumnFilter',
          onCellValueChanged: (event) => {
            const { title, id } = event.data;
            if (title) {
              const payload = { data: { title }, id };
              dispatch(updateTenantRequest({ ...payload }));
            } else {
              toast.error('Title cannot be null');
              onRefreshCallback();
            }
          },
        },
        {
          field: 'actions',
          // eslint-disable-next-line react/no-unstable-nested-components
          cellRenderer: (params) => (
            <ActionsRenderer
              params={params}
              onEditClickCallback={(e) => onEditClickCallback(e, params)}
              onSelectClickCallback={(e) => onSelectClickCallback(e, params)}
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

  const sideBar = useMemo(
    () => ({
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

  const onGridReady = useCallback(
    (params) => {
      dispatch(fetchTenants());
    },
    [dispatch],
  );

  useEffect(() => {
    if (rows) {
      setRowData(agGridTenantsDTO(rows));

      if (gridRef.current?.api) {
        gridRef.current?.api.sizeColumnsToFit();
      }
    }
    if (gridRef.current?.api && selectedWorkspace) {
      gridRef.current?.api.forEachNodeAfterFilter((rowNode) => {
        rowNode.setSelected(rowNode.data.title === selectedWorkspace?.title);
      });
    }
  }, [width, rows, selectedWorkspace]);

  // navigation
  const onPaginationChanged = () => {
    if (gridRef.current!.api!) {
      setCurrentPage(gridRef.current!.api.paginationGetCurrentPage() + 1);
      setTotalPage(gridRef.current!.api.paginationGetTotalPages());
    }
  };

  return (
    <PageWrapper pageTitle="Workspaces" icon="fa-solid fa-building">
      <div style={containerStyle}>
        <NewTenantModal />
        <EditTenantModal tenantToEdit={tenantToEdit} />
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
            groupDisplayType="multipleColumns"
            animateRows
            onGridReady={onGridReady}
            icons={icons}
            paginationPageSize={10}
            pagination
            suppressPaginationPanel
            suppressScrollOnNewData
            onPaginationChanged={onPaginationChanged}
            onFirstDataRendered={onFirstDataRendered}
            enableRangeSelection
            masterDetail
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
