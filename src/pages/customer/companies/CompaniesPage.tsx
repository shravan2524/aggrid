import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import PageTitle from 'components/PageTitle';
import { fetchCompaniesData } from 'services/companiesAPIService';
import { AgGridReact } from 'ag-grid-react';
import { agGridRowDrag } from 'app/utils/Helpers';
import { useWindowDimensions } from 'app/hooks';

export default function CompaniesPage() {
  const gridRef = useRef<any>();
  const { height, width } = useWindowDimensions();

  const [rowData, setRowData] = useState<any>();

  const containerStyle = useMemo(() => ({ width: '100%', height: `${(height)}px`, minHeight: '600px' }), [height, width]);

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: 'Companies Details',
      children: [
        {
          headerName: 'ID',
          field: 'id',
          agGridRowDrag,
          filter: 'agNumberColumnFilter',
          chartDataType: 'category',
        },
        {
          headerName: 'Sys Company ID',
          field: 'sys_company_id',
          agGridRowDrag,
          filter: 'agNumberColumnFilter',
          chartDataType: 'category',
        },
        {
          headerName: 'Name',
          field: 'name',
          agGridRowDrag,
          filter: 'agTextColumnFilter',
          chartDataType: 'category',
        },
        {
          headerName: 'Parent',
          field: 'parent',
          agGridRowDrag,
          filter: 'agNumberColumnFilter',
          chartDataType: 'category',
        },
        {
          headerName: 'Customer Id',
          field: 'customer_id',
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

  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current?.api.sizeColumnsToFit();
    }
  }, [width]);

  return (
    <div className="container-fluid ag-theme-alpine grid-container-style">
      <PageTitle title="Companies" />
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
