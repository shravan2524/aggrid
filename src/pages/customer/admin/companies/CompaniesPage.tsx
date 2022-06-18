import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import { hideModal, showModal } from 'app/utils/Modal';
import { useAppDispatch, useCompanies, useWindowDimensions } from 'app/hooks';
import PageWrapper from 'components/PageWrapper';
import {
  fetchCompanies, updateCompanyRequest,
} from 'state/companies/companiesSlice';
import { agGridCompaniesDTO } from 'app/utils/Helpers';
import { CompaniesType } from 'services/companiesAPIService';
import { useSelector } from 'react-redux';
import { availableCustomers } from 'state/customers/customersSlice';
import { ICellRendererParams } from 'ag-grid-community';
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
    <div className="d-flex justify-content-around align-items-center w-100 h-100 ">
      <button type="button" className="btn btn-sm btn-light" onClick={(e) => onEditClickCallback(e, params)}>
        <i className="fa-solid fa-pen-to-square" />
        {' '}
        Edit
      </button>
      <button type="button" className="btn btn-sm btn-danger" onClick={(e) => onCredentialsClickCallback(e, params)}>
        <i className="fa-solid fa-key" />
        {' '}
        Credentials
      </button>
    </div>
  );
}

function CustomActionsToolPanel() {
  return (
    <div className="container-fluid">
      <div className="row p-2">
        <button
          type="button"
          className="btn btn-sm btn-danger"
          onClick={() => showModal('newCompanyModal')}
        >
          <i className="fa-solid fa-circle-plus" />
          {' '}
          Add Company
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

  const [rowData, setRowData] = useState<any>();

  const anyCustomer = useSelector(availableCustomers);
  const { height, width } = useWindowDimensions();
  const rows = useCompanies();
  const [companyData, setCompanyData] = useState<CompaniesType | null>(null);

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

  const sideBar = useMemo(() => ({
    toolPanels: [
      {
        id: 'customActionsTool',
        labelDefault: 'Actions',
        labelKey: 'customActionsTool',
        iconKey: 'custom-actions-tool',
        toolPanel: CustomActionsToolPanel,
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
    dispatch(fetchCompanies());
  }, []);

  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current?.api.sizeColumnsToFit();
    }
  }, [width, rows]);

  useEffect(() => {
    setRowData(agGridCompaniesDTO(rows));

    if (gridRef.current?.api) {
      gridRef.current?.api.sizeColumnsToFit();
    }
  }, [rows]);

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
