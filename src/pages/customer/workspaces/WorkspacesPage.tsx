import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import { showModal } from 'app/utils/Modal';
import { useAppDispatch, useWindowDimensions } from 'app/hooks';
import PageWrapper from 'components/PageWrapper';
import {
  fetchCustomers, updateCustomerRequest,
  getCustomers, setSelectedCustomer,
} from 'state/customers/customersSlice';
import { agGridCustomersDTO } from 'app/utils/Helpers';
import { CustomersType } from 'services/customersAPIService';
import { useSelector } from 'react-redux';
import { ICellRendererParams } from 'ag-grid-community';
import { setSelectedCompany } from 'state/companies/companiesSlice';
import NewCustomerModal from './NewCustomerModal';
import EditCustomerModal from './EditCustomerModal';

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

function CustomActionsToolPanel() {
  return (
    <div className="container-fluid">
      <div className="row p-2">
        <button
          type="button"
          className="btn btn-sm btn-danger"
          onClick={() => showModal('newCustomerModal')}
        >
          <i className="fa-solid fa-circle-plus" />
          {' '}
          Add new Workspace
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

export default function WorkspacesPage() {
  const dispatch = useAppDispatch();
  const gridRef = useRef<any>();

  const rows = useSelector(getCustomers);
  const [customerToEdit, setCustomerToEdit] = useState<CustomersType | null>(null);

  const { height, width } = useWindowDimensions();

  const [rowData, setRowData] = useState<any>();

  const containerStyle = useMemo(() => ({
    width: '100%',
    height: `${(height)}px`,
    minHeight: '600px',
  }), [height, width]);

  const onEditClickCallback = (e, params) => {
    setCustomerToEdit(params.data);
    showModal('editCustomerModal');
  };

  const onSelectClickCallback = (e, params) => {
    if (params.data) {
      if (params.data.id) {
        dispatch(setSelectedCompany(null));
        dispatch(setSelectedCustomer(params.data.id));
      }
    }
  };

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: 'Customers Details',
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
            dispatch(updateCustomerRequest({ ...payload }));
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
    dispatch(fetchCustomers());
  }, []);

  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current?.api.sizeColumnsToFit();
    }
  }, [width, rows]);

  useEffect(() => {
    setRowData(agGridCustomersDTO(rows));

    if (gridRef.current?.api) {
      gridRef.current?.api.sizeColumnsToFit();
    }
  }, [rows]);

  return (
    <PageWrapper pageTitle="Workspaces" icon="fa-solid fa-building">

      <div className=" ag-theme-alpine grid-container-style">
        <NewCustomerModal />
        <EditCustomerModal customerToEdit={customerToEdit} />
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
