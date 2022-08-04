import React, {
  useCallback, useMemo, useRef, useState,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import { agGridRowDrag } from 'app/utils/Helpers';
import { useWindowDimensions } from 'app/hooks';
import PageWrapper from 'components/PageWrapper';
import { GridReadyEvent, IServerSideDatasource } from 'ag-grid-community';
import { fetchReconciliationData } from 'services/reconciliationAPIService';

function ClickableStatusBarComponent(props: any, onBtExport) {
  const { api } = props;
  return (
    <div className="ag-status-name-value">
      <button
        onClick={onBtExport}
        className="btn btn-outline-success btn-sm"
        type="button"
      >
        <i className="fas fa-sign-out-alt" />
        {' '}
        Export to Excel
      </button>
    </div>
  );
}

function generateRowsAndGroups(rows) {
    const convertCamelCaseToSpaceCase = (text) => {
        const textFormatted = text.replace('_', ' ');
        const result = textFormatted.replace(/([A-Z])/g, ' $1');
        return result.charAt(0).toUpperCase() + result.slice(1);
    };

    const getFilterType = (string) => {
        if (string.toLowerCase().includes('date')) {
            return 'agDateColumnFilter';
        }
        if (string.toLowerCase().includes('amount') || string.toLowerCase().includes('total')) {
            return 'agNumberColumnFilter';
        }

        return 'agTextColumnFilter';
    };

  return Object.keys(rows[0]).map((r) => ({
      headerName: convertCamelCaseToSpaceCase(r),
      field: r,
      agGridRowDrag,
      filter: getFilterType(convertCamelCaseToSpaceCase(r)),
      chartDataType: 'category',
    }));
}

export default function ReconciliationPage() {
  const gridRef = useRef<any>();
  const { height } = useWindowDimensions();
  const containerStyle = useMemo(
    () => ({ width: '100%', height: `${height}px`, minHeight: '600px' }),
    [height],
  );

  const [columnDefs, setColumnDefs] = useState<any[]>([]);

  // CUSTOM ICON
  const icons = useMemo<{ [key: string]: Function | string }>(
    () => ({
      'custom-actions-tool': '<i class="fa-solid fa-screwdriver-wrench"></i>',
    }),
    [],
  );

  // EXPORT BUTTON
  const onBtExport = useCallback(() => {
    gridRef.current!.api.exportDataAsExcel({
      author: 'Finkraft',
      fontSize: 13,
      sheetName: 'Reconciliation Details',
      fileName: 'ReconciliationData.xlsx',
    });
  }, []);

  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      minWidth: 250,
      sortable: true,
      filter: true,
      floatingFilter: true,
      enableRowGroup: true,
      enableValue: true,
    }),
    [],
  );

  const onGridReady = useCallback((params: GridReadyEvent) => {
    const dataSource: IServerSideDatasource = {
      getRows: (prms) => {
        fetchReconciliationData({ dataRequest: { ...prms.request } }).then((res) => {
          if (res.rows) {
            const tempRows = res.rows;
            const rowsAndGroups = generateRowsAndGroups(res.rows);
            setColumnDefs(rowsAndGroups);
            prms.success({
              rowData: tempRows,
              rowCount: res.count,
            });
          }
        }).catch((e) => {
          console.error(e);
          prms.fail();
        });
      },
    };
    params.api!.setServerSideDatasource(dataSource);
  }, []);

  const statusBar = useMemo(() => ({
    statusPanels: [
      { statusPanel: (pr) => ClickableStatusBarComponent(pr, onBtExport) },
    ],
  }), []);

    // SIDE BAR
    const sideBar = useMemo(
        () => ({
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
            defaultToolPanel: 'customActionsTool',
        }),
        [],
    );

  return (
    <PageWrapper pageTitle="Reconciliation">
      <div className="container-fluid ag-theme-alpine grid-container-style">
        <AgGridReact
          containerStyle={containerStyle}
          ref={gridRef}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          rowModelType="serverSide"
          groupDisplayType="multipleColumns"
          rowGroupPanelShow="always"
          paginationPageSize={10}
          statusBar={statusBar}
          cacheBlockSize={10}
          serverSideStoreType="partial"
          sideBar={sideBar}
          pagination
        />
      </div>
    </PageWrapper>
  );
}
