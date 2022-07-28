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
  ColDef, CellClassParams, GridReadyEvent, ICellRendererParams, IServerSideDatasource,
} from 'ag-grid-community';
import { fetchFileContentData } from 'services/filesAPIService';
import { tenantUuid } from 'state/tenants/helper';
import { BACKEND_API } from 'app/config';

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

// main Function
export default function DetailCellRenderer({ data, node, api }: ICellRendererParams) {
  const gridRef = useRef<any>();
  const [hide, setHide] = useState<boolean>(false);
  const [columnGroupsData, setColumnGroupsData] = useState<any>();

  const gridStyle = useMemo(() => ({ height: '400px', width: '90%' }), []);
  const Columns = data.agGridColumns.map((f: any) => ({
    headerName: f.columnTitle,
    field: f.columnName,
    filter: 'agTextColumnFilter',
    editable: false,
    cellStyle: (params) => (params.value === 'ERROR' ? { backgroundColor: 'red' } : null),
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

  // useEffect(() => {
  //   const options: RequestInit = {
  //     method: 'GET',
  //     credentials: 'include',
  //   };
  //   const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/column-groups`;
  //   fetch(apiUrl, options)
  //     .then((response) => response.json())
  //     .then((res) => {
  //       setColumnGroupsData(res);
  //     });
  // }, []);

  // useEffect(() => {
  //   setColumnDefs(columnGroupsData);
  //   const newColumnGrouping = {};
  //   const newColumnsStructure: any = [];
  //   const columnsToRemoveFromParent: any = {};
  //   if (columnGroupsData) {
  //     columnGroupsData.forEach((c) => {
  //       newColumnGrouping[c.id] = c.title;
  //     });

  //     const columnGroupingHeaders: any = {};

  //     if (data.columnMapping) {
  //       Object.values(data.columnMapping).forEach((val: any, i) => {
  //         if (newColumnGrouping[val.columnGroup]) {
  //           columnGroupingHeaders[newColumnGrouping[val.columnGroup]] = [];
  //         }
  //       });

  //       const columnGroupingData: any = {};
  //       Object.keys(data.columnMapping).forEach((colName: any, i) => {
  //         const colData = data.columnMapping[colName];
  //         if (colData.columnGroup) {
  //           if (newColumnGrouping[Number(colData.columnGroup)]) {
  //             const colGroupName = newColumnGrouping[Number(colData.columnGroup)];
  //             columnGroupingData[colGroupName] = data.agGridColumns.filter((c: any) => data.columnMapping[c.columnTitle]);
  //           }
  //         }
  //       });

  //       Object.keys(columnGroupingData).forEach((headerName) => {
  //         const clData = columnGroupingData[headerName];
  //         const children: any = [];
  //         clData.forEach((v) => {
  //           columnsToRemoveFromParent[v.columnTitle] = v.columnName;
  //           children.push({
  //             headerName: v.columnTitle,
  //             field: v.columnName,
  //             filter: 'agTextColumnFilter',
  //             editable: false,
  //           });
  //         });
  //         newColumnsStructure.push({
  //           headerName,
  //           children,
  //         });
  //       });
  //     }
  //   }
  //   const newColumnsCleanedUp = data.agGridColumns.filter((c) => !columnsToRemoveFromParent[c.columnTitle]).map((cl) => ({
  //     headerName: cl.columnTitle,
  //     field: cl.columnName,
  //     filter: 'agTextColumnFilter',
  //     editable: false,
  //   }));
  //   const newData = [...newColumnsStructure, ...newColumnsCleanedUp];
  // }, [columnGroupsData]);

  // rows
  const onGridReady = useCallback((params: GridReadyEvent) => {
    const dataSource: IServerSideDatasource = {
      getRows: (prms) => {
        fetchFileContentData({ id: data.id, dataRequest: { ...prms.request } }).then((res) => {
          if (res.rows) {
            console.log(res.rows);
            const temprows = res.rows;
            temprows.forEach((e) => {
              Object.keys(e.errors).forEach((key) => {
                if (e.errors[key] != null) {
                  e[key] = 'ERROR';
                }
            });
            });
            console.log(temprows);
            prms.success({
              rowData: temprows,
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

  const statusBar = useMemo(() => ({
    statusPanels: [
      { statusPanel: (pr) => ClickableStatusBarComponent(pr, onBtExport) },
    ],
  }), []);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
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
          statusBar={statusBar}
          cacheBlockSize={10}
          serverSideStoreType="partial"
          pagination
        />
      </div>
    </div>
  );
}
