import React, {
  useCallback,
  useMemo, useRef, useState,
} from 'react';
import { fetchQRData } from 'services/qrAPIService';

import { AgGridReact } from 'ag-grid-react';
import { agGridRowDrag } from 'app/utils/Helpers';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useWindowDimensions } from 'app/hooks';
import PageWrapper from 'components/PageWrapper';

export default function ReconciliationQrPage() {
  const gridRef = useRef<any>();
  const navigate = useNavigate();
  const { height } = useWindowDimensions();

  const containerStyle = useMemo(() => ({ width: '100%', height: `${(height)}px`, minHeight: '600px' }), [height]);

  const [rowData, setRowData] = useState<any>();

  const [columnDefs, setColumnDefs] = useState([{
    headerName: 'QR Details',
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
        headerName: 'seller Gstin',
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
        headerName: 'Document Type',
        field: 'document_type',
        agGridRowDrag,
        filter: 'agTextColumnFilter',
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
        headerName: 'Items Count',
        field: 'items_count',
        agGridRowDrag,
        filter: 'agNumberColumnFilter',
        chartDataType: 'category',
      },
      {
        headerName: 'Hsn Code',
        field: 'hsn_code',
        agGridRowDrag,
        filter: 'agTextColumnFilter',
        chartDataType: 'category',
      },
      {
        headerName: 'Nic Sign',
        field: 'nic_sign',
        agGridRowDrag,
        filter: 'agTextColumnFilter',
        chartDataType: 'category',
      },
      {
        headerName: 'QR Detected',
        field: 'qr_detected',
        agGridRowDrag,
        filter: 'agTextColumnFilter',
        chartDataType: 'category',
      },
      // Meta Data
      {
        headerName: 'Filename',
        field: 'filename',
        agGridRowDrag,
        filter: 'agTextColumnFilter',
        chartDataType: 'category',
      },
      {
        headerName: 'S3 Url',
        field: 's3_url',
        agGridRowDrag,
        filter: 'agTextColumnFilter',
        chartDataType: 'category',
      },
      {
        headerName: 'Page Image Link',
        field: 'page_image_link',
        agGridRowDrag,
        filter: 'agTextColumnFilter',
        chartDataType: 'category',
      },
      // ./Fin - Meta Data
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
      setRowData(twoAData);
    });
  }, []);

  return (
    <PageWrapper pageTitle="QR">
      <div className="container-fluid ag-theme-alpine grid-container-style">
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
