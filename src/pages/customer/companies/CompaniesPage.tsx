import React, {
  useCallback, useMemo, useRef, useState,
} from 'react';
import PageTitle from 'components/PageTitle';
import { fetchCompaniesData } from 'services/companiesAPIService';
import { AgGridReact } from 'ag-grid-react';
import { agGridRowDrag } from 'app/utils/Helpers';

export default function CompaniesPage() {
  const gridRef = useRef<any>();

  const [rowData, setRowData] = useState<any>();

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: 'Companies Details',
      children: [
        {
          field: 'Id',
          agGridRowDrag,
          filter: 'agNumberColumnFilter',
          chartDataType: 'category',
        },
        {
          field: 'Sys Company Id',
          agGridRowDrag,
          filter: 'agNumberColumnFilter',
          chartDataType: 'category',
        },
        {
          field: 'Name',
          agGridRowDrag,
          filter: 'agTextColumnFilter',
          chartDataType: 'category',
        },
        {
          field: 'Parent',
          agGridRowDrag,
          filter: 'agNumberColumnFilter',
          chartDataType: 'category',
        },
        {
          field: 'Customer Id',
          agGridRowDrag,
          filter: 'agNumberColumnFilter',
          chartDataType: 'category',
        },
      ],
    },
  ]);

  const sideBar = useMemo(() => ({
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
    defaultToolPanel: 'customStats',
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

  const statusBar = useMemo(() => ({
    statusPanels: [
      {
        statusPanel: 'agAggregationComponent',
        statusPanelParams: {
          aggFuncs: ['count', 'sum'],
        },
      },
    ],
  }), []);

  const onGridReady = useCallback((params) => {
    fetchCompaniesData().then((twoAData) => {
      console.log(twoAData);
      setRowData(twoAData);
      gridRef.current?.api.sizeColumnsToFit();
    });
  }, []);

  return (
    <div className="container-fluid ag-theme-alpine grid-container-style">
      <PageTitle title="Companies" />
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
        pagination
        onFirstDataRendered={onFirstDataRendered}
        groupIncludeFooter
        groupIncludeTotalFooter
        enableRangeSelection
        statusBar={statusBar}
        masterDetail
      />
    </div>
  );
}
