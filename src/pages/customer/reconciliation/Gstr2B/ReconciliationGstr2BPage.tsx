import React, {
  useCallback, useMemo, useRef, useState,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import { agGridRowDrag } from 'app/utils/Helpers';
import { useWindowDimensions } from 'app/hooks';
import PageWrapper from 'components/PageWrapper';
import { fetchGSTR2BData } from 'services/GSTR2BServiceAPI';
import { GSTR2BColums } from './Gstr2BColum';

function CustomActionsToolPanel(onBtExport: any) {
  return (
    <div className="container-fluid">
      <div className="row p-2 gap-2">
        <button
          onClick={onBtExport}
          type="button"
          className="btn btn-sm btn-success d-flex gap-2 align-items-center justify-content-center"
        >
          <i className="fas fa-sign-out-alt" />
          Export to Excel
        </button>
      </div>
    </div>
  );
}

export default function ReconciliationGstr2BPage() {
  const gridRef = useRef<any>();
  const { height } = useWindowDimensions();
  const containerStyle = useMemo(
    () => ({ width: '100%', height: `${height}px`, minHeight: '600px' }),
    [height],
  );
  const [rowData, setRowData] = useState<any>();
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: '2B Details',
      children: GSTR2BColums(agGridRowDrag),
    },
  ]);

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
      sheetName: '2B Details',
      fileName: 'Datas.xlsx',
    });
  }, []);
  // SIDE BAR
  const sideBar = useMemo(
    () => ({
      toolPanels: [
        {
          id: 'customActionsTool',
          labelDefault: 'Actions',
          labelKey: 'customActionsTool',
          iconKey: 'custom-actions-tool',
          toolPanel: () => CustomActionsToolPanel(onBtExport),
        },
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
    }),
    [],
  );
  // COLUMS
  const defaultColDef = useMemo(
    () => ({
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

  const onGridReady = useCallback((params) => {
    fetchGSTR2BData().then((twoAData) => {
      console.log(twoAData);
      setRowData(twoAData);
    });
  }, []);

  return (
    <PageWrapper pageTitle="2B">
      <div className="container-fluid ag-theme-alpine grid-container-style">
        <AgGridReact
          containerStyle={containerStyle}
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          sideBar={sideBar}
          icons={icons}
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
          masterDetail
        />
      </div>
    </PageWrapper>
  );
}
