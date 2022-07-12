import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import { onModalHidden, showModal } from 'app/utils/Modal';
import { useAppDispatch, useCompanies, useWindowDimensions } from 'app/hooks';
import PageWrapper from 'components/PageWrapper';
import {
  fetchCompanies, updateCompanyRequest, isLoadingSelector,
} from 'state/companies/companiesSlice';
import { agGridCompaniesDTO } from 'app/utils/Helpers';
import { CompaniesType } from 'services/companiesAPIService';
import { useSelector } from 'react-redux';
import { availableTenants } from 'state/tenants/tenantsSlice';
import { ICellRendererParams } from 'ag-grid-community';
import classNames from 'classnames';
import { toast } from 'react-hot-toast';
import NewCompanyModal from './NewCompanyModal';
import EditCompanyModal from './EditCompanyModal';
import CompanyCredentialsModal from './CompanyCredentialsModal';

type ActionsRendererProps = {
  params: ICellRendererParams;
  onEditClickCallback: (e: React.MouseEvent<HTMLButtonElement>, params: ICellRendererParams) => void;
  onCredentialsClickCallback: (e: React.MouseEvent<HTMLButtonElement>, params: ICellRendererParams) => void;
};

function ActionsRenderer({ params, onEditClickCallback, onCredentialsClickCallback }: ActionsRendererProps) {
  return (
    <div className="d-flex align-items-center w-100 h-100">
      <button type="button" className="btn btn-sm btn-light " onClick={(e) => onEditClickCallback(e, params)}>
        <i className="fa-solid fa-pen-to-square" />
        {' '}
        Edit
      </button>
      {params.data.gstin !== '' && (
      <button
        type="button"
        className="btn btn-sm btn-danger ml-4"
        onClick={(e) => onCredentialsClickCallback(e, params)}
      >
        <i className="fa-solid fa-key" />
        {' '}
        Credentials
      </button>
)}
    </div>
  );
}

function CustomActionsToolPanel(onRefreshCallback, isFetchLoading) {
  return (
    <div className="container-fluid">
      <div className="row p-2 gap-2">
        <button
          type="button"
          className="btn btn-sm btn-danger px-4 d-flex gap-2 align-items-center justify-content-center"
          onClick={() => showModal('newCompanyModal')}
        >
          <i className="fa-solid fa-circle-plus" />
          Add Company
        </button>
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

function ParentRenderer(params) {
  let result = '---';

  try {
    const parentId = params.data.parent;
    params.api.forEachNode((rowNode) => {
      if (rowNode.data.id.toString() === parentId.toString()) {
        result = rowNode.data.name;
      }
    });

    return result;
  } catch (e) {
    return result;
  }
}

export default function CompaniesPage() {
  const dispatch = useAppDispatch();
  const gridRef = useRef<any>();

  const [rowData, setRowData] = useState<any[]>([]);

  const anyCustomer = useSelector(availableTenants);
  const { height, width } = useWindowDimensions();
  const rows: any = useCompanies();
  const [companyData, setCompanyData] = useState<CompaniesType | null>(null);
  const isFetchLoading = useSelector(isLoadingSelector);

  const containerStyle = useMemo(() => ({
    width: '100%',
    height: `${(height)}px`,
    minHeight: '600px',
  }), [height, width]);

  const onEditClickCallback = (e, params) => {
    setCompanyData(params.data);
    showModal('editCompanyModal', () => {
      setCompanyData(null);
    });
  };

  const onCredentialsClickCallback = (e, params) => {
    setCompanyData(params.data);
    showModal('editCredentialsCompanyModal', () => {
      setCompanyData(null);
    });
  };

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: 'Companies Details',
      children: [
        {
          headerName: 'ID',
          field: 'id',
          filter: 'agNumberColumnFilter',
          editable: false,
        },
        {
          headerName: 'GSTIN',
          field: 'gstin',
          filter: 'agNumberColumnFilter',
          onCellValueChanged: (event) => {
            const { gstin, id } = event.data;

            const isValidGSTIN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstin);

            if (isValidGSTIN) {
              const payload = { data: { gstin }, id };
              dispatch(updateCompanyRequest({ ...payload }));
            } else {
              toast.error('Invalid GSTIN Format');
            }
          },
        },
        {
          headerName: 'Name',
          field: 'name',
          filter: 'agTextColumnFilter',
          onCellValueChanged: (event) => {
            const { name, id } = event.data;
            const payload = { data: { name }, id };
            dispatch(updateCompanyRequest({ ...payload }));
          },
        },
        {
          headerName: 'Parent',
          field: 'parent',
          filter: 'agNumberColumnFilter',
          valueGetter: ParentRenderer,
          editable: false,
        },
        {
          field: 'actions',
          // eslint-disable-next-line react/no-unstable-nested-components
          cellRenderer: (params) => (
            <ActionsRenderer
              params={params}
              onEditClickCallback={(e) => onEditClickCallback(e, params)}
              onCredentialsClickCallback={(e) => onCredentialsClickCallback(e, params)}
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

  const icons = useMemo<{ [key: string]: Function | string; }>(() => ({
    'custom-actions-tool': '<i class="fa-solid fa-screwdriver-wrench"></i>',
  }), []);

  const onRefreshCallback = useCallback(() => {
    dispatch(fetchCompanies());
  }, []);

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

  const onNewCompanyHiddenCache = useCallback(() => onModalHidden('newCompanyModal', () => dispatch(fetchCompanies())), []);

  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current?.api.sizeColumnsToFit();
    }
  }, [width, rows]);

  useEffect(() => {
    if (rows.length) {
      setRowData(agGridCompaniesDTO(rows));
    }

    if (gridRef.current?.api) {
      gridRef.current?.api.sizeColumnsToFit();
    }
  }, [rows]);

  useEffect(() => {
    onNewCompanyHiddenCache();
  }, []);

  if (!anyCustomer) {
    return (
      <PageWrapper pageTitle="Companies" icon="fa-solid fa-building">
        <div className="col">
          <div className="alert alert-info" role="alert">
            You have no Workspaces set, please set first at less one Workspace in order to use Companies .
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper pageTitle="Companies" icon="fa-solid fa-building">

      <div className=" ag-theme-alpine grid-container-style">
        <NewCompanyModal />
        <EditCompanyModal companyData={companyData} />
        <CompanyCredentialsModal companyData={companyData} />
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
