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
  const [hide, setHide] = useState<boolean>(false);
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
      if (res.count > 0) {
        setHide(true);
      }
    });
  }, []);

  // export button
  const onBtExport = useCallback(() => {
    gridRef.current!.api.exportDataAsExcel({
      author: 'Finkraft',
      fontSize: 13,
      sheetName: 'Finkraft',
      fileName: 'finkraft-datas.xlsx',
    });
  }, []);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <div
        className="d-flex justify-content-end pb-2 pt-4"
        style={{ width: '90%' }}
      >
        {hide && (
          <button
            onClick={onBtExport}
            className="btn btn-outline-success btn-sm"
            type="button"
          >
            <i className="fas fa-sign-out-alt mr-2" />
            Export to Excel
          </button>
        )}
      </div>
      <div style={gridStyle} className="ag-theme-alpine py-2">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          animateRows
          onGridReady={onGridReady}
          pagination
        />
      </div>
    </div>
  );
}
