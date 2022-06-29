import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  ICellRendererParams,
} from 'ag-grid-community';

export default function DetailCellRenderer({ data, node, api }: ICellRendererParams) {
  const gridStyle = useMemo(() => ({ height: '400px', width: '90%' }), []);
  const Columns = data.agGridColumns.map((f: any) => ({ field: f.columnTitle }));
  const colDefs = Columns;

  const defaultColDef = useMemo<ColDef>(() => ({ flex: 1, minWidth: 200 }), []);

  // const onGridReady = (params: GridReadyEvent) => {
  //   const gridInfo: DetailGridInfo = {
  //     id: rowId,
  //     api: params.api,
  //     columnApi: params.columnApi,
  //   };

  //   console.log('adding detail grid info with id: ', rowId);

  //   api.addDetailGridInfo(rowId, gridInfo);
  // };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
    >
      <div style={gridStyle} className="ag-theme-alpine py-4">
        <AgGridReact
          data-id="detailGrid"
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          rowData={data.agGridColumns}
          // onGridReady={onGridReady}
        />
      </div>
    </div>
  );
}
