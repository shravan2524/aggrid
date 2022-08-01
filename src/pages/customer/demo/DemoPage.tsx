import React, {
    useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import PageWrapper from 'components/PageWrapper';
import PDFPreviewer from 'components/PDFPreviewer';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle';
import { AgGridReact } from 'ag-grid-react';
import './styles.css';
import { GetFilename } from 'app/utils/Helpers';

const agGridData = require('./Q1_Travel_Booking_Matched_with_Invoice_and_2A_f1000.json');

function Modal(props: any) {
    return (
      <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">New message</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="recipient-name" className="col-form-label">Recipient:</label>
                  <input type="text" className="form-control" id="recipient-name" />
                </div>
                <div className="mb-3">
                  <label htmlFor="message-text" className="col-form-label">Message:</label>
                  <textarea className="form-control" id="message-text" />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary">Send message</button>
            </div>
          </div>
        </div>
      </div>
    );
}

function rowDrag(params: any) {
    // only rows that are NOT groups should be draggable
    return !params.node.group;
}

const totalStyle = { paddingBottom: '15px' };

function CustomStatsToolPanel(props: any) {
    const { api } = props;

    const [numAirlines, setNumAirlines] = useState(0);
    const [numIndigo, setNumIndigo] = useState(0);
    const [numAirIndia, setNumAirIndia] = useState(0);
    const [numJetAirways, setNumJetAirways] = useState(0);

    const updateTotals = () => {
        let numIndigo1 = 0;
        let numAirIndia1 = 0;
        let numJetAirways1 = 0;

        api.forEachNode((rowNode: any) => {
            const { data } = rowNode;

            if (data) {
                if ('Airline Name' in data) {
                    if (data['Airline Name'] === 'Indigo') {
                        numIndigo1 += 1;
                    }

                    if (data['Airline Name'] === 'Air India') {
                        numAirIndia1 += 1;
                    }

                    if (data['Airline Name'] === 'Jet Airways') {
                        numJetAirways1 += 1;
                    }
                }
            }
        });

        const numAgencies1 = numIndigo1 + numAirIndia1 + numJetAirways1;

        setNumAirlines(numAgencies1);
        setNumIndigo(numIndigo1);
        setNumAirIndia(numAirIndia1);
        setNumJetAirways(numJetAirways1);
    };

    useEffect(() => {
        api.addEventListener('modelUpdated', updateTotals);

        return () => api.removeEventListener('modelUpdated', updateTotals);
    }, []);

    return (
      <div style={{ textAlign: 'center' }}>
        <span>
          <h2>
            <i className="fa fa-calculator" />
            {' '}
            Custom Stats
          </h2>
          <dl style={{ fontSize: 'large', padding: '30px 40px 10px 30px' }}>
            <dt style={totalStyle}>
              Total Airlines:
              {' '}
              <b>{numAirlines}</b>
            </dt>
            <dt style={totalStyle}>
              Total Indigo:
              {' '}
              <b>{numIndigo}</b>
            </dt>
            <dt style={totalStyle}>
              Total Air India:
              {' '}
              <b>{numAirIndia}</b>
            </dt>
            <dt style={totalStyle}>
              Total Jet Airways:
              {' '}
              <b>{numJetAirways}</b>
            </dt>

          </dl>
        </span>
      </div>
    );
}

function TotalValueRenderer(props: any) {
    const { value, valueFormatted } = props;
    const cellValue = valueFormatted || value;

    const buttonClicked = () => {
        const myModal = new bootstrap.Modal(document.getElementById('exampleModal'), {
            keyboard: false,
        });

        myModal.show();
    };

    return (
      <span>
        <span>{cellValue}</span>
        {' '}
        <button type="button" className="btn btn-light btn-sm" onClick={() => buttonClicked()}>
          <i className="fa-solid fa-comment-dots" />
        </button>
      </span>
    );
}

function ClickableStatusBarComponent(props: any) {
    const { api } = props;

    const onClick = () => {
        alert(`Selected Row Count: ${api.getSelectedRows().length}`);
    };

    return (
      <div className="ag-status-name-value">
        <span>
          Status Bar Component&nbsp;
          <input type="button" onClick={() => onClick()} value="Click Me" />
        </span>
      </div>
    );
}

function CountStatusBarComponent(props: any) {
    const { api } = props;
    const [count, setCount] = useState(true);

    useEffect(() => {
        setCount(api.getModel().rowsToDisplay.length);
    }, []);

    return (
      <div className="ag-status-name-value">
        <span className="component">Row Count Component&nbsp;</span>
        <span className="ag-status-name-value-value">{count}</span>
      </div>
    );
}

function DetailCellRenderer(props: any) {
    const { data } = props;
    const [selectedPreviewPdf, setSelectedPreviewPdf] = useState(null);
    const [availablePreviewPdf, setAvailablePreviewPdf] = useState([]);

    useEffect(() => {
        let valueArray = [];
        if (data['Invoice link']) {
            const value = data['Invoice link'];
            valueArray = value ? value.split(',') : [];
        }

        setAvailablePreviewPdf(valueArray);
    }, []);

    useEffect(() => {
        if (availablePreviewPdf[0]) {
            setSelectedPreviewPdf(availablePreviewPdf[0]);
        }
    }, [availablePreviewPdf]);

    return (
      <div className="container-fluid h-100 overflow-auto">
        <div className="d-flex justify-content-evenly align-items-center flex-wrap border-bottom">
          {availablePreviewPdf.map((link, i) => (
            <button type="button" onClick={() => setSelectedPreviewPdf(availablePreviewPdf[i])} key={i} className="btn btn-sm btn-link m-2 p-1">
              <small>
                (
                {i + 1}
                )
                {' '}
                {GetFilename(link)}
              </small>
            </button>
                ))}
        </div>
        {availablePreviewPdf.length && (<PDFPreviewer file={selectedPreviewPdf} />)}
      </div>
    );
}
const OnExpand = (i: any) => {
    i.node.setExpanded(!i.node.expanded);
  };

export default function DemoPage() {
    const gridRef = useRef<any>();
    const containerStyle = useMemo(
        () => ({ width: '100%', height: '600px' }),
        [],
    );
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
    const [rowData, setRowData] = useState<any>();

    const [columnDefs, setColumnDefs] = useState([

        // Airline Details
        {
          field: '',
          // eslint-disable-next-line react/no-unstable-nested-components
          cellRenderer: (params) => (
            <div aria-hidden="true" onClick={() => OnExpand(params)}>
              <i className="fa fa-link" />
            </div>
          ),
          editable: false,
          filter: false,
          width: 40,
          minWidth: 40,
          maxWidth: 40,
        },
        {
            headerName: 'Airline Details',
            children: [
                {
                    field: 'Airline Name',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                    cellRenderer: TotalValueRenderer,
                    chartDataType: 'category',
                },
                {
                    field: 'Type',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                    chartDataType: 'category',
                },
                {
                    field: 'Name as per GST Portal - Booking',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                    chartDataType: 'category',
                },
            ],
        },

        // Invoice
        {
            headerName: 'Invoice Details',
            children: [
                {
                    field: 'Invoice Number - Invoice',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                },
                {
                    field: 'Invoice Date - Invoice',
                    rowDrag,
                    filter: 'agDateColumnFilter',
                },
                {
                    field: 'Customer GSTIN - Invoice',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                },
                {
                    field: 'Name as per GST portal - Invoice',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                },
                {
                    field: 'Supplier GSTIN - Invoice',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                },
                {
                    field: 'Invoice Number - 2A',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                },
                {
                    field: 'Invoice Date - 2A',
                    rowDrag,
                    filter: 'agDateColumnFilter',
                },
                {
                    field: 'Taxable - Invoice',
                    rowDrag,
                    filter: 'agNumberColumnFilter',
                    allowedAggFuncs: ['sum', 'min', 'max'],
                },
                {
                    field: 'CGST - Invoice',
                    rowDrag,
                    filter: 'agNumberColumnFilter',
                    allowedAggFuncs: ['sum', 'min', 'max'],
                },
                {
                    field: 'SGST - Invoice',
                    rowDrag,
                    filter: 'agNumberColumnFilter',
                    allowedAggFuncs: ['sum', 'min', 'max'],
                },
                {
                    field: 'IGST - Invoice',
                    rowDrag,
                    filter: 'agNumberColumnFilter',
                    allowedAggFuncs: ['sum', 'min', 'max'],
                },
                {
                    field: 'Total GST - Invoice',
                    rowDrag,
                    filter: 'agNumberColumnFilter',
                    allowedAggFuncs: ['sum', 'min', 'max'],
                },
                {
                    field: 'Invoice link clickable 1',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                },
                {
                    field: 'Invoice link clickable 2',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                },
                {
                    field: 'Invoice Status',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                    chartDataType: 'category',
                },
                {
                    field: 'Total Amount - Invoice',
                    rowDrag,
                    filter: 'agNumberColumnFilter',
                    allowedAggFuncs: ['sum', 'min', 'max'],
                    headerTooltip: 'The Total Invoice Amount',
                    enableValue: true,
                    suppressMenu: true,
                    chartDataType: 'series',
                    aggFunc: 'sum',
                },
                {
                    field: 'Document Type - Invoice',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                },
                {
                    field: 'Invoice link',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                    editable: false,
                    // cellRenderer: InvoiceLinkRenderer,
                    cellRenderer: 'agGroupCellRenderer',
                },
            ],
        },

        // Agency Details
        {
            headerName: 'Agency Details',
            children: [
                {
                    field: 'Agency Invoice Number',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                },
                {
                    field: 'Agency Name',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                    enableValue: true,
                    suppressMenu: true,
                    chartDataType: 'category',
                },
                {
                    field: 'Agency CGST - Booking',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                },
                {
                    field: 'Agency IGST - Booking',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                },
                {
                    field: 'Agency SGST - Booking',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                },
            ],
        },

        // Transaction
        {
            headerName: 'Transaction Details',
            children: [
                {
                    field: 'Transaction Amount',
                    rowDrag,
                    filter: 'agNumberColumnFilter',
                    allowedAggFuncs: ['sum', 'min', 'max'],
                    headerTooltip: 'The Transaction Amount',
                    enableValue: true,
                    suppressMenu: true,
                    chartDataType: 'series',

                    aggFunc: 'sum',
                },
                {
                    field: 'Transaction Type',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                    chartDataType: 'category',

                },
                {
                    field: 'Transaction Date',
                    rowDrag,
                    filter: 'agDateColumnFilter',
                },
            ],
        },

        // Customer
        {
            headerName: 'Customer Details',
            children: [
                {
                    field: 'Customer Name - Booking',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                },
                {
                    field: 'Customer GSTIN - Booking',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                },
                {
                    field: 'Verify Customer GSTIN',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                },
                {
                    field: 'Customer GSTIN - 2A',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                },
            ],
        },

        // 2A
        {
            headerName: '2A Details',
            children: [
                {
                    field: 'Name as per GST portal - 2A',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                },
                {
                    field: 'Supplier GSTIN - 2A',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                },

                {
                    field: 'Taxable - 2A',
                    rowDrag,
                    filter: 'agNumberColumnFilter',
                    allowedAggFuncs: ['sum', 'min', 'max'],
                },
                {
                    field: 'CGST - 2A',
                    rowDrag,
                    filter: 'agNumberColumnFilter',
                    allowedAggFuncs: ['sum', 'min', 'max'],
                },
                {
                    field: 'SGST - 2A',
                    rowDrag,
                    filter: 'agNumberColumnFilter',
                    allowedAggFuncs: ['sum', 'min', 'max'],
                },
                {
                    field: 'IGST - 2A',
                    rowDrag,
                    filter: 'agNumberColumnFilter',
                    allowedAggFuncs: ['sum', 'min', 'max'],
                },
                {
                    field: 'Total GST - 2A',
                    rowDrag,
                    filter: 'agNumberColumnFilter',
                    allowedAggFuncs: ['sum', 'min', 'max'],
                },
                {
                    field: '2A Status',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                    chartDataType: 'category',
                },
            ],
        },

        // Traveller
        {
            headerName: 'Traveller Details',
            children: [
                {
                    field: 'Traveller Name',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                },
                {
                    field: 'Class',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                },
                {
                    field: 'a.t1.Traveller Name',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                },
                {
                    field: 'First Name',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                },
                {
                    field: 'Last Name',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                },
                {
                    field: 'Location',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                    chartDataType: 'category',
                },
            ],
        },

        // Other
        {
            headerName: 'Other Details',
            children: [
                {
                    field: 'Delay in days',
                    rowDrag,
                    filter: 'agNumberColumnFilter',
                    allowedAggFuncs: ['sum', 'min', 'max'],
                },
                {
                    field: 'Workspace',
                    rowDrag: true,
                    filter: 'agTextColumnFilter',
                },
                {
                    field: 'Ticket Number',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                },
                {
                    field: 'PNR',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                },
                {
                    field: 'Domestic/International',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                },
                {
                    field: 'Origin',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                },
                {
                    field: 'Ticket/PNR',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                },
                {
                    field: 'Booking GST',
                    rowDrag,
                    filter: 'agNumberColumnFilter',
                    allowedAggFuncs: ['sum', 'min', 'max'],
                },
                {
                    field: 'GST Difference',
                    rowDrag,
                    filter: 'agNumberColumnFilter',
                    allowedAggFuncs: ['sum', 'min', 'max'],
                },
                {
                    field: 'Data Source',
                    rowDrag,
                    filter: 'agTextColumnFilter',
                },
            ],
        },
    ]);

    const icons = useMemo(() => ({
        'custom-stats': '<i class="fa-solid fa-chart-column"></i>',
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

    /*  const onGridReady = useCallback((params) => {
            fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
              .then((resp) => resp.json())
              .then((data) => setRowData(data));
          }, []); */

    const onGridReady = useCallback((params) => {
        setRowData(agGridData);
    }, []);

    const onFirstDataRendered = useCallback((params) => {
        //  gridRef.current.api.sizeColumnsToFit();
    }, []);

    const autoGroupColumnDef = useMemo(() => ({
        headerName: 'Airline',
        field: 'Airline Name',
        minWidth: 220,
        cellRendererParams: {
            // suppressCount: true,
            checkbox: true,
            footerValueGetter: (params) => {
                const isRootLevel = params.node.level === -1;
                if (isRootLevel) {
                    return 'Grand Total';
                }
                return `Sub Total (${params.value})`;
            },
        },
    }), []);

    const statusBar = useMemo(() => ({
        statusPanels: [
            { statusPanel: CountStatusBarComponent },
            { statusPanel: ClickableStatusBarComponent },
            {
                statusPanel: 'agAggregationComponent',
                statusPanelParams: {
                    aggFuncs: ['count', 'sum'],
                },
            },
        ],
    }), []);

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
            {
                id: 'customStats',
                labelDefault: 'Custom Stats',
                labelKey: 'customStats',
                iconKey: 'custom-stats',
                toolPanel: CustomStatsToolPanel,
            },
        ],
        defaultToolPanel: 'customStats',
    }), []);

    const detailCellRenderer = useMemo(() => DetailCellRenderer, []);

    return (
      <PageWrapper pageTitle="Demo">
        <div style={containerStyle}>
          <div style={gridStyle} className="ag-theme-alpine">
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              sideBar={sideBar}
              autoGroupColumnDef={autoGroupColumnDef}
              rowSelection="multiple"
              rowDragManaged
              rowDragMultiRow
              rowGroupPanelShow="always"
              defaultColDef={defaultColDef}
              enableCharts
              groupDisplayType="multipleColumns"
              animateRows
              onGridReady={onGridReady}
              onFirstDataRendered={onFirstDataRendered}
              groupIncludeFooter
              groupIncludeTotalFooter
              icons={icons}
              enableRangeSelection
              statusBar={statusBar}
              detailRowHeight={800}
              masterDetail
              detailCellRenderer={detailCellRenderer}
            />
            <Modal />
          </div>
        </div>
      </PageWrapper>
    );
}
