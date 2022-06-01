import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import { showModal } from 'app/utils/Modal';
import { agGridRowDrag } from 'app/utils/Helpers';
import { useAppDispatch, useWindowDimensions } from 'app/hooks';
import PageWrapper from 'components/PageWrapper';
import { useSelector } from 'react-redux';
import { fetchCompanies, getAllCompanies } from 'state/companies/companiesSlice';
import { selectSelectedCustomer } from 'state/customers/customersSlice';
import NewCompanyModal from './NewCompanyModal';

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

export default function CompaniesPage() {
  const dispatch = useAppDispatch();
  const gridRef = useRef<any>();
  const rows = useSelector(getAllCompanies);
  const selectedCustomer = useSelector(selectSelectedCustomer);

  const { height, width } = useWindowDimensions();

  const [rowData, setRowData] = useState<any>();

  const containerStyle = useMemo(() => ({ width: '100%', height: `${(height)}px`, minHeight: '600px' }), [height, width]);

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: 'Companies Details',
      children: [
        {
          headerName: 'Name',
          field: 'name',
          agGridRowDrag,
          filter: 'agTextColumnFilter',
          chartDataType: 'category',
          onCellValueChanged: (event) => {
            console.log(event);
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
    if (selectedCustomer) {
      setRowData(rows.filter((com) => Number(com.customer_id) === Number(selectedCustomer.id)));
    } else {
      setRowData([]);
    }
  }, [rows, selectedCustomer]);

  return (
    <PageWrapper pageTitle="Companies" icon="fa-solid fa-building">

      <div className=" ag-theme-alpine grid-container-style">
        <NewCompanyModal />

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
          enableCharts
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
