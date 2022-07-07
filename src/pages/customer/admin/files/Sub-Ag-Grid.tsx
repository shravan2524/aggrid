import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import {
  ColDef, GridReadyEvent, ICellRendererParams, IServerSideDatasource,
} from 'ag-grid-community';
import { fetchFileContentData } from 'services/filesAPIService';

// main Function
export default function DetailCellRenderer({
  data,
  node,
  api,
}: ICellRendererParams) {
  const gridRef = useRef<any>();
  const [hide, setHide] = useState<boolean>(false);
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
      floatingFilter: true,
      enableRowGroup: true,
      enableValue: true,
    }),
    [],
  );

  // rows
  const onGridReady = useCallback((params: GridReadyEvent) => {
    const dataSource: IServerSideDatasource = {
      getRows: (prms) => {
        console.log(prms.request);

        fetchFileContentData({ id: data.id, dataRequest: { ...prms.request } }).then((res) => {
          if (res.rows) {
            prms.success({
              rowData: res.rows,
              rowCount: res.count,
            });
          }
          if (res.count > 0) {
            setHide(true);
          }
        }).catch((e) => {
          prms.fail();
        });
      },
    };

    params.api!.setServerSideDatasource(dataSource);
  }, [data]);

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
            <i className="fas fa-sign-out-alt" />
            {' '}
            Export to Excel
          </button>
        )}
      </div>
      <div style={gridStyle} className="ag-theme-alpine py-2">
        <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          rowModelType="serverSide"
          groupDisplayType="multipleColumns"
          rowGroupPanelShow="always"
          paginationPageSize={10}
          cacheBlockSize={10}
          serverSideStoreType="partial"
          pagination
        />
      </div>
    </div>
  );
}
