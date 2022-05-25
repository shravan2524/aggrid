import React, {
  useCallback, useEffect, useState, useRef, useMemo,
} from 'react';

import { AgGridReact } from 'ag-grid-react';

import PageTitle from 'components/PageTitle';
import { fetch2AData } from 'services/2AAPIService';
import { agGridRowDrag } from 'app/utils/Helpers';

export default function Reconciliation2APage() {
  const gridRef = useRef<any>();

  const [rowData, setRowData] = useState<any>();

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: '2A Details',
      children: [
        {
          headerName: 'ID',
          field: 'id',
          agGridRowDrag,
          filter: 'agNumberColumnFilter',
          chartDataType: 'category',
        },
        {
          headerName: 'Workspace',
          field: 'workspace',
          agGridRowDrag,
          filter: 'agTextColumnFilter',
          chartDataType: 'category',
        },
        {
          headerName: 'Invoice Number',
          field: 'invoice_number',
          agGridRowDrag,
          filter: 'agTextColumnFilter',
          chartDataType: 'category',
        },
        {
          headerName: 'Invoice Date',
          field: 'invoice_date',
          agGridRowDrag,
          filter: 'agDateColumnFilter',
          chartDataType: 'category',
        },
        {
          headerName: 'Seller Gstin',
          field: 'seller_gstin',
          agGridRowDrag,
          filter: 'agTextColumnFilter',
          chartDataType: 'category',
        },
        {
          headerName: 'Buyer Gstin',
          field: 'buyer_gstin',
          agGridRowDrag,
          filter: 'agTextColumnFilter',
          chartDataType: 'category',
        },
        {
          headerName: 'Filing Period',
          field: 'filing_period',
          agGridRowDrag,
          filter: 'agDateColumnFilter',
          chartDataType: 'category',
        },
        {
          headerName: 'Document Type',
          field: 'document_type',
          agGridRowDrag,
          filter: 'agTextColumnFilter',
          chartDataType: 'category',
        },
        {
          headerName: 'Original Invoice Number',
          field: 'original_invoice_number',
          agGridRowDrag,
          filter: 'agTextColumnFilter',
          chartDataType: 'category',
        },
        {
          headerName: 'Original Invoice Date',
          field: 'original_invoice_date',
          agGridRowDrag,
          filter: 'agDateColumnFilter',
          chartDataType: 'category',
        },
        {
          headerName: 'Total Amount',
          field: 'total_amount',
          agGridRowDrag,
          filter: 'agNumberColumnFilter',
          chartDataType: 'category',
        },
        {
          headerName: 'Igst',
          field: 'igst',
          agGridRowDrag,
          filter: 'agNumberColumnFilter',
          chartDataType: 'category',
        },
        {
          headerName: 'Cgst',
          field: 'cgst',
          agGridRowDrag,
          filter: 'agNumberColumnFilter',
          chartDataType: 'category',
        },
        {
          headerName: 'Sgst',
          field: 'sgst',
          agGridRowDrag,
          filter: 'agNumberColumnFilter',
          chartDataType: 'category',
        },
        {
          headerName: 'Total Gst',
          field: 'total_gst',
          agGridRowDrag,
          filter: 'agNumberColumnFilter',
          chartDataType: 'category',
        },
        {
          headerName: 'Taxable Amount',
          field: 'taxable_amount',
          agGridRowDrag,
          filter: 'agNumberColumnFilter',
          chartDataType: 'category',
        },
        {
          headerName: 'Tax Rate',
          field: 'tax_rate',
          agGridRowDrag,
          filter: 'agNumberColumnFilter',
          chartDataType: 'category',
        },
        {
          headerName: 'Irn',
          field: 'irn',
          agGridRowDrag,
          filter: 'agTextColumnFilter',
          chartDataType: 'category',
        },
        {
          headerName: 'Irn Date',
          field: 'irn_date',
          agGridRowDrag,
          filter: 'agDateColumnFilter',
          chartDataType: 'category',
        },
        {
          headerName: 'Row Updated At',
          field: 'row_updated_at',
          agGridRowDrag,
          filter: 'agDateColumnFilter',
          chartDataType: 'category',
        },
        {
          headerName: 'Extra Information',
          field: 'extra_information',
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
    fetch2AData().then((twoAData) => {
      console.log(twoAData);
      setRowData(twoAData);
    });
  }, []);

  return (
    <div className="container-fluid ag-theme-alpine grid-container-style">
      <PageTitle title="2A" />
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
