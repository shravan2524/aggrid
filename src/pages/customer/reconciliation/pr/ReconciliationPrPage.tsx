import React, {
  useCallback,
  useMemo, useRef, useState,
} from 'react';
import { fetchPRData } from 'services/prAPIService';
import { AgGridReact } from 'ag-grid-react';
import { agGridRowDrag } from 'app/utils/Helpers';
import { useWindowDimensions } from 'app/hooks';
import PageWrapper from 'components/PageWrapper';
import ColumnMapping from 'components/ColumnMapping';

export default function ReconciliationPrPage() {
  const gridRef = useRef<any>();
  const { height } = useWindowDimensions();

  const containerStyle = useMemo(() => ({ width: '100%', height: `${(height)}px`, minHeight: '600px' }), [height]);

  const [rowData, setRowData] = useState<any>();

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: 'PR Details',
      children: [
		{
	  headerName: 'ID',
	  headerGroupComponent: ColumnMapping,
	  children: [{
		  field: 'id',
		agGridRowDrag,
		filter: 'agTextColumnFilter',
		chartDataType: 'category',
	  }
	  ],
	},
	  {
		  headerName: 'Workspace',
		  headerGroupComponent: ColumnMapping,
		  children:[{
		headerName: 'Workspace',
		field: 'workspace',
		agGridRowDrag,
		filter: 'agTextColumnFilter',
		chartDataType: 'category',
	  }]
	  },
	  {
		  headerName: 'Invoice Number',
		  headerGroupComponent: ColumnMapping,
		  children:[{
		headerName: 'Invoice Number',
		field: 'invoice_number',
		agGridRowDrag,
		filter: 'agTextColumnFilter',
		chartDataType: 'category',
	  }]
	  },
	  {
		  headerName: 'Invoice Date',
		  headerGroupComponent: ColumnMapping,
		  children:[{
		headerName: 'Invoice Date',
		field: 'invoice_date',
		agGridRowDrag,
		filter: 'agDateColumnFilter',
		chartDataType: 'category',
		  }]
	  },
	  {
		  headerName: 'Seller Gstin',
		  headerGroupComponent: ColumnMapping,
		  children:[{
		headerName: 'Seller Gstin',
		field: 'seller_gstin',
		agGridRowDrag,
		filter: 'agTextColumnFilter',
		chartDataType: 'category',
		  }]
	  },
	  {
		  headerName: 'Buyer Gstin',
		  headerGroupComponent: ColumnMapping,
		  children:[{
		headerName: 'Buyer Gstin',
		field: 'buyer_gstin',
		agGridRowDrag,
		filter: 'agTextColumnFilter',
		chartDataType: 'category',
	  }]
	  },
	  {
		  headerName: 'Filling Period',
		  headerGroupComponent: ColumnMapping,
		  children:[{
		headerName: 'Filing Period',
		field: 'filing_period',
		agGridRowDrag,
		filter: 'agDateColumnFilter',
		chartDataType: 'category',
		  }]
	  },
	  {headerName: 'Document Type',
	  headerGroupComponent: ColumnMapping,
	  children:[{
		headerName: 'Document Type',
		field: 'document_type',
		agGridRowDrag,
		filter: 'agTextColumnFilter',
		chartDataType: 'category',
	  }]
	  },
	  {
		  headerName: 'Original Invoice Number',
		  headerGroupComponent: ColumnMapping,
		  children:[{
		headerName: 'Original Invoice Number',
		field: 'original_invoice_number',
		agGridRowDrag,
		filter: 'agTextColumnFilter',
		chartDataType: 'category',
		  }]
	  },
	  {
		  headerName: 'Original Invoice Date',
		  headerGroupComponent: ColumnMapping,
		  children:[{
		headerName: 'Original Invoice Date',
		field: 'original_invoice_date',
		agGridRowDrag,
		filter: 'agDateColumnFilter',
		chartDataType: 'category',
	  }]
	  },
	  {
		  headerName: 'Total Amount',
		  headerGroupComponent: ColumnMapping,
		  children:[{
		headerName: 'Total Amount',
		field: 'total_amount',
		agGridRowDrag,
		filter: 'agNumberColumnFilter',
		chartDataType: 'category',
		  }]
	  },
	  {
		  headerName: 'Igst',
		  headerGroupComponent: ColumnMapping,
		  children:[{
		headerName: 'Igst',
		field: 'igst',
		agGridRowDrag,
		filter: 'agNumberColumnFilter',
		chartDataType: 'category',
		  }]
	  },
	  {
		  headerName: 'Cgst',
		  headerGroupComponent: ColumnMapping,
		  children:[{
		headerName: 'Cgst',
		field: 'cgst',
		agGridRowDrag,
		filter: 'agNumberColumnFilter',
		chartDataType: 'category',
		  }]
	  },
	  {
		  headerName: 'Sgst',
		  headerGroupComponent: ColumnMapping,
		  children:[{
		headerName: 'Sgst',
		field: 'sgst',
		agGridRowDrag,
		filter: 'agNumberColumnFilter',
		chartDataType: 'category',
		  }]
	  },
	  {
		  headerName: 'Total Gst',
		  headerGroupComponent: ColumnMapping,
		  children:[{
		headerName: 'Total Gst',
		field: 'total_gst',
		agGridRowDrag,
		filter: 'agNumberColumnFilter',
		chartDataType: 'category',
		  }]
	  },
	  {
		  headerName: 'Taxable Amount',
		  headerGroupComponent: ColumnMapping,
		  children:[{
		headerName: 'Taxable Amount',
		field: 'taxable_amount',
		agGridRowDrag,
		filter: 'agNumberColumnFilter',
		chartDataType: 'category',
		  }]
	  },
	  {
		  headerName: 'Tax rate',
		  headerGroupComponent: ColumnMapping,
		  children:[{
		headerName: 'Tax Rate',
		field: 'tax_rate',
		agGridRowDrag,
		filter: 'agNumberColumnFilter',
		chartDataType: 'category',
		  }]
	  },
	  {
		  headerName: 'Irn',
		  headerGroupComponent: ColumnMapping,
		  children:[{
		headerName: 'Irn',
		field: 'irn',
		agGridRowDrag,
		filter: 'agTextColumnFilter',
		chartDataType: 'category',
	  }]
	  },
	  // Meta Data ...
	  {
		headerName: 'Filename',
		headerGroupComponent: ColumnMapping,
		children:[{
		headerName: 'Filename',
		field: 'filename',
		agGridRowDrag,
		filter: 'agTextColumnFilter',
		chartDataType: 'category',
		}]
	  },
	  // ./ Fin Meta Data
	  {headerName: 'Voucher Number',
	  headerGroupComponent: ColumnMapping,
	  children:[{
		headerName: 'Voucher Number',
		field: 'voucher_number',
		agGridRowDrag,
		filter: 'agTextColumnFilter',
		chartDataType: 'category',
	  }]
	  },
	  {
		headerName: 'Row Updated At',
		headerGroupComponent: ColumnMapping,
		children:[{
		headerName: 'Row Updated At',
		field: 'row_updated_at',
		agGridRowDrag,
		filter: 'agDateColumnFilter',
		chartDataType: 'category',
		}]
	  },
	  {
		headerName: 'Extra Information',
		headerGroupComponent: ColumnMapping,
		children:[{
		headerName: 'Extra Information',
		field: 'extra_information',
		agGridRowDrag,
		filter: 'agTextColumnFilter',
		chartDataType: 'category',
		}]
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
    fetchPRData().then((twoAData) => {
      console.log(twoAData);
      setRowData(twoAData);
    });
  }, []);

  return (
    <PageWrapper pageTitle="PR">
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
