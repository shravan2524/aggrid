import React, {
  useCallback, useState, useRef, useMemo,
} from 'react';

import { AgGridReact } from 'ag-grid-react';

import { fetch2AData } from 'services/2AAPIService';
import { agGridRowDrag } from 'app/utils/Helpers';
import PageWrapper from 'components/PageWrapper';
import { useWindowDimensions } from 'app/hooks';
import ColumnMapping from 'components/ColumnMapping';
import { string } from 'yup/lib/locale';

export default function Reconciliation2APage() {
  const gridRef = useRef<any>();
  const { height } = useWindowDimensions();

  const containerStyle = useMemo(() => ({ width: '100%', height: `${(height)}px`, minHeight: '600px' }), [height]);

  const [rowData, setRowData] = useState<any>();
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: '2A Details',
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
			headerName: 'Filling Perios',
			headerGroupComponent: ColumnMapping,
			children:[{
          headerName: 'Filing Period',
          field: 'filing_period',
          agGridRowDrag,
          filter: 'agDateColumnFilter',
          chartDataType: 'category',
			}]
        },
        {headerName: 'Document Typee',
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
        {
			headerName: 'Irn Date',
			headerGroupComponent: ColumnMapping,
			children:[{
          headerName: 'Irn Date',
          field: 'irn_date',
          agGridRowDrag,
          filter: 'agDateColumnFilter',
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
    fetch2AData().then((twoAData) => {
      console.log(twoAData);
      setRowData(twoAData);
    });
  }, []);

  return (
    <PageWrapper pageTitle="2A">
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
