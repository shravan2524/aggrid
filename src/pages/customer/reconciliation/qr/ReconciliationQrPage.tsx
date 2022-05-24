import React, {
  useCallback,
  useMemo, useRef, useState,
} from 'react';
import PageTitle from 'components/PageTitle';
import { fetchQRData } from 'services/qrAPIService';

import { AgGridReact } from 'ag-grid-react';
import { agGridRowDrag } from 'app/utils/Helpers';

export default function ReconciliationQrPage() {
  const gridRef = useRef<any>();

  const [rowData, setRowData] = useState<any>();

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: 'QR Details',
      children: [
        {
          field: 'Id',
          agGridRowDrag,
          filter: 'agNumberColumnFilter',
          chartDataType: 'category',
        },
        {
          field: 'Workspace',
          agGridRowDrag,
          filter: 'agTextColumnFilter',
          chartDataType: 'category',
        },
        {
          field: 'Invoice Number',
          agGridRowDrag,
          filter: 'agTextColumnFilter',
          chartDataType: 'category',
        },
        {
          field: 'Invoice Date',
          agGridRowDrag,
          filter: 'agDateColumnFilter',
          chartDataType: 'category',
        },
        {
          field: 'Seller Gstin',
          agGridRowDrag,
          filter: 'agTextColumnFilter',
          chartDataType: 'category',
        },
        {
          field: 'Buyer Gstin',
          agGridRowDrag,
          filter: 'agTextColumnFilter',
          chartDataType: 'category',
        },

        {
          field: 'Document Type',
          agGridRowDrag,
          filter: 'agTextColumnFilter',
          chartDataType: 'category',
        },

        {
          field: 'Total Amount',
          agGridRowDrag,
          filter: 'agNumberColumnFilter',
          chartDataType: 'category',
        },
        {
          field: 'Irn',
          agGridRowDrag,
          filter: 'agTextColumnFilter',
          chartDataType: 'category',
        },
        {
          field: 'Irn Date',
          agGridRowDrag,
          filter: 'agDateColumnFilter',
          chartDataType: 'category',
        },
        {
          field: 'Items Count',
          agGridRowDrag,
          filter: 'agNumberColumnFilter',
          chartDataType: 'category',
        },
        {
          field: 'Hsn Code',
          agGridRowDrag,
          filter: 'agTextColumnFilter',
          chartDataType: 'category',
        },
        {
          field: 'Nic Sign',
          agGridRowDrag,
          filter: 'agTextColumnFilter',
          chartDataType: 'category',
        },

        {
          field: 'QR Detected',
          agGridRowDrag,
          filter: 'agTextColumnFilter',
          chartDataType: 'category',
        },

        // Meta Data
        {
          field: 'Filename',
          agGridRowDrag,
          filter: 'agTextColumnFilter',
          chartDataType: 'category',
        },

        {
          field: 'S3 Url',
          agGridRowDrag,
          filter: 'agTextColumnFilter',
          chartDataType: 'category',
        },

        {
          field: 'Page Image Link',
          agGridRowDrag,
          filter: 'agTextColumnFilter',
          chartDataType: 'category',
        },
        // ./Fin - Meta Data

        {
          field: 'Row Updated At',
          agGridRowDrag,
          filter: 'agDateColumnFilter',
          chartDataType: 'category',
        },
        {
          field: 'Extra Information',
          agGridRowDrag,
          filter: 'agTextColumnFilter',
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

  const onFirstDataRendered = useCallback((params) => {
    //  gridRef.current.api.sizeColumnsToFit();
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
    fetchQRData().then((twoAData) => {
      console.log(twoAData);
      setRowData(twoAData);
    });
  }, []);

  return (
    <div className="container-fluid ag-theme-alpine grid-container-style">
      <PageTitle title="QR" />
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
