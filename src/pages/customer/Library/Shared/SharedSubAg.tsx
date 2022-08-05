import React, {
  useCallback, useMemo, useRef, useState,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import { ColDef, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';

function ClickableStatusBarComponent(props: any, onBtExport) {
  return (
    <div className="ag-status-name-value d-flex gap-4">
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

// main Function
export default function SharedDetailCellRenderer({
  data,
  node,
  api,
}: ICellRendererParams) {
  const gridRef = useRef<any>();

  const gridStyle = useMemo(() => ({ height: '600px', width: '90%' }), []);

  // default Columns settings
  const [columnDefs, setColumnDefs] = useState([]);
  const defaultColDef = useMemo<ColDef>(
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

  // rows
  const onGridReady = useCallback((params: GridReadyEvent) => {}, [data]);

  // export button
  const onBtExport = useCallback(() => {
    gridRef.current!.api.exportDataAsExcel({
      author: 'Finkraft',
      fontSize: 13,
      sheetName: 'Finkraft',
      fileName: 'finkraft-datas.xlsx',
    });
  }, []);

  const statusBar = useMemo(
    () => ({
      statusPanels: [
        {
          statusPanel: (pr) => ClickableStatusBarComponent(pr, onBtExport),
        },
      ],
    }),
    [],
  );

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <div style={gridStyle} className="ag-theme-alpine py-2">
        <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          groupDisplayType="multipleColumns"
          rowGroupPanelShow="always"
          paginationPageSize={10}
          statusBar={statusBar}
          pagination
        />
      </div>
    </div>
  );
}
