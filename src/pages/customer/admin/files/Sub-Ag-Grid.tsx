import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  ICellRendererParams,
} from 'ag-grid-community';
import { fetchFileContentData } from 'services/filesAPIService';

export default function DetailCellRenderer({ data, node, api }: ICellRendererParams) {
  const [rowData, setRowData] = useState<any>();
  const gridStyle = useMemo(() => ({ height: '400px', width: '90%' }), []);
  const Columns = data.agGridColumns.map((f: any) => (
    {
      headerName: f.columnTitle,
      field: f.columnName,
      filter: 'agTextColumnFilter',
      editable: false,
    }
  ));

  const [columnDefs, setColumnDefs] = useState(Columns);

  const defaultColDef = useMemo<ColDef>(() => ({ flex: 1, minWidth: 200 }), []);

  console.log(data);

  const onGridReady = useCallback((params) => {
    fetchFileContentData({ id: data.id }).then((res) => {
      if (res.rows) {
        setRowData(res.rows);
      }
    });
  }, []);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
    >
      <div style={gridStyle} className="ag-theme-alpine py-4">
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          detailRowHeight={400}
          defaultColDef={defaultColDef}
          animateRows
          onGridReady={onGridReady}
          pagination
        />
      </div>
    </div>
  );
}
