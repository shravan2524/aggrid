import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import { showModal } from 'app/utils/Modal';
import { useAppDispatch, useWindowDimensions } from 'app/hooks';
import PageWrapper from 'components/PageWrapper';
import {
  fetchTenants, updateTenantRequest,
  getTenants, setSelectedTenant, getSelectedTenant,
} from 'state/tenants/tenantsSlice';
import { agGridTenantsDTO } from 'app/utils/Helpers';
import { TenantAGGridType, TenantType } from 'services/tenantsAPIService';
import { useSelector } from 'react-redux';
import { ICellRendererParams } from 'ag-grid-community';
import { setSelectedCompany, isLoadingSelector } from 'state/companies/companiesSlice';
import classNames from 'classnames';
import NewTenantModal from './NewTenantModal';
import EditTenantModal from './EditTenantModal';

type ActionsRendererProps = {
  params: ICellRendererParams;
  onEditClickCallback: (e: React.MouseEvent<HTMLButtonElement>, params: ICellRendererParams) => void;
  onSelectClickCallback: (e: React.MouseEvent<HTMLButtonElement>, params: ICellRendererParams) => void;
};
function ActionsRenderer({ params, onEditClickCallback, onSelectClickCallback }: ActionsRendererProps) {
  return (
    <div className="d-flex justify-content-evenly align-items-center w-100 h-100">
      <button type="button" className="btn btn-sm btn-light" onClick={(e) => onEditClickCallback(e, params)}>
        <i className="fa-solid fa-pen-to-square" />
        {' '}
        Edit
      </button>
      <button type="button" className="btn btn-sm btn-light" onClick={(e) => onSelectClickCallback(e, params)}>
        <i className="fa-solid fa-circle-check" />
        {' '}
        Select
      </button>
    </div>
  );
}

function CustomActionsToolPanel(onRefreshCallback, isFetchLoading) {
  return (
    <div className="col">
      <div className="row p-2 gap-2 m-1">
        <button
          type="button"
          className="btn btn-sm btn-danger px-4 d-flex gap-2 align-items-center justify-content-center flex-wrap"
          onClick={() => showModal('newTenantModal')}
        >
          <i className="fa-solid fa-circle-plus" />
          Add new Workspace
        </button>
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

export default function WorkspacesPage() {
  const dispatch = useAppDispatch();
  const gridRef = useRef<any>();
  const rows = useSelector(getTenants);
  const selectedWorkspace = useSelector(getSelectedTenant);
  const [tenantToEdit, setTenantToEdit] = useState<TenantType | null>(null);
  const isFetchLoading = useSelector(isLoadingSelector);
  const { height, width } = useWindowDimensions();

  const [rowData, setRowData] = useState<TenantAGGridType[] >([]);

  const containerStyle = useMemo(() => ({
    width: '100%',
    height: `${(height)}px`,
    minHeight: '600px',
  }), [height, width]);

  const onEditClickCallback = (e, params) => {
    setTenantToEdit(params.data);
    showModal('editTenantModal');
  };

  const onSelectClickCallback = (e, params) => {
    if (params.data) {
      if (params.data.id) {
        dispatch(setSelectedCompany(null));
        dispatch(setSelectedTenant(params.data.id));
      }
    }
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
            const payload = { data: { title }, id };
            dispatch(updateTenantRequest({ ...payload }));
          },
        },
        {
          field: 'actions',
          // eslint-disable-next-line react/no-unstable-nested-components
          cellRenderer: (params) => (<ActionsRenderer params={params} onEditClickCallback={(e) => onEditClickCallback(e, params)} onSelectClickCallback={(e) => onSelectClickCallback(e, params)} />),
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
    dispatch(fetchTenants());
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

  const onGridReady = useCallback((params) => {
    dispatch(fetchTenants());
  }, [dispatch]);

  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current?.api.sizeColumnsToFit();
    }
  }, [width, rows]);

  useEffect(() => {
    if (rows) {
      setRowData(agGridTenantsDTO(rows));

      if (gridRef.current?.api) {
        gridRef.current?.api.sizeColumnsToFit();
      }
    }
  }, [rows]);

  useEffect(() => {
    if (gridRef.current?.api && selectedWorkspace) {
      gridRef.current?.api.forEachNodeAfterFilter((rowNode) => {
        rowNode.setSelected(rowNode.data.title === selectedWorkspace?.title);
      });
    }
  }, [selectedWorkspace]);

  return (
    <PageWrapper pageTitle="Workspaces" icon="fa-solid fa-building">

      <div className=" ag-theme-alpine grid-container-style">
        <NewTenantModal />
        <EditTenantModal tenantToEdit={tenantToEdit} />
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
          enableRangeSelection
          masterDetail
        />
      </div>

    </PageWrapper>
  );
}
