import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { fetchFileContentData } from 'services/filesAPIService';

// main Function
export default function DetailCellRenderer({
  data,
  node,
  api,
}: ICellRendererParams) {
  const gridRef = useRef<any>();
  const [rowData, setRowData] = useState<any>();
  const gridStyle = useMemo(() => ({ height: '400px', width: '90%' }), []);
  // columns
  const Columns = data.agGridColumns.map((f: any) => ({
    headerName: f.columnTitle,
    field: f.columnName,
    filter: 'agTextColumnFilter',
    editable: false,
  }));
  // default Columns settings
  const [columnDefs, setColumnDefs] = useState(Columns);
  const defaultColDef = useMemo<ColDef>(
    () => ({
      flex: 1,
      minWidth: 250,
      sortable: true,
      filter: true,
      resizable: true,
      floatingFilter: true,
      enableRowGroup: true,
      editable: true,
      enablePivot: true,
      enableValue: true,
    }),
    [],
  );

  // rows
  const onGridReady = useCallback((params) => {
    fetchFileContentData({ id: data.id }).then((res) => {
      if (res.rows) {
        setRowData(res.rows);
      }
    });
  }, []);
  return (
    <div className="d-flex justify-content-center align-items-center">
      <div style={gridStyle} className="ag-theme-alpine py-4">
        <AgGridReact
          ref={gridRef}
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
