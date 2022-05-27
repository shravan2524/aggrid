import React, {
  useCallback, useMemo, useRef, useState,
} from 'react';
import { fetchCustomersData } from 'services/customersAPIService';
import { AgGridReact } from 'ag-grid-react';
import { agGridRowDrag } from 'app/utils/Helpers';
import { useWindowDimensions } from 'app/hooks';
import PageWrapper from 'components/PageWrapper';

export default function CustomersPage() {
  const gridRef = useRef<any>();
  const { height } = useWindowDimensions();

  const containerStyle = useMemo(() => ({ width: '100%', height: `${(height)}px`, minHeight: '600px' }), [height]);

  const [rowData, setRowData] = useState<any>();

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: 'Customer Details',
      children: [
        {
          field: 'id',
          agGridRowDrag,
          filter: 'agNumberColumnFilter',
          chartDataType: 'category',
        },
        {
          field: 'uuid',
          agGridRowDrag,
          filter: 'agTextColumnFilter',
          chartDataType: 'category',
        },
        {
          field: 'title',
          agGridRowDrag,
          filter: 'agTextColumnFilter',
          chartDataType: 'category',
        },
        {
          field: 'parent',
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
    fetchCustomersData().then((twoAData) => {
      setRowData(twoAData);
      gridRef.current?.api.sizeColumnsToFit();
    });
  }, []);

  return (
    <PageWrapper pageTitle="Customers">
      <div className="ag-theme-alpine grid-container-style">
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
    </PageWrapper>
  );
}
