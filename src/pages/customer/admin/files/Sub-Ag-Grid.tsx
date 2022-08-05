import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import {
  ColDef,
  GridReadyEvent,
  ICellRendererParams,
  IServerSideDatasource,
} from 'ag-grid-community';
import { fetchFileContentData } from 'services/filesAPIService';
import NewSharePopup from 'components/Library/NewSharePopup';
import { Modal } from 'react-bootstrap';

function ClickableStatusBarComponent(props: any, onBtExport, handleShow) {
  const { api } = props;
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
      <button
        type="button"
        className="btn btn-sm btn-success  px-4 d-flex gap-2 align-items-center justify-content-center flex-wrap"
        onClick={handleShow}
      >
        <i className="fas fa-user-plus" />
        Share Data
      </button>
    </div>
  );
}

// main Function
export default function DetailCellRenderer({
  data,
  node,
  api,
}: ICellRendererParams) {
  const gridRef = useRef<any>();
  const [hide, setHide] = useState<boolean>(false);
  const [show, setShow] = useState(false);
  const [filterSetting, setFilterSetting] = useState({});
  const handleShow = () => setShow(true);

  const gridStyle = useMemo(() => ({ height: '600px', width: '90%' }), []);
  const Columns = data.agGridColumns.map((f: any) => ({
    headerName: f.columnTitle,
    field: f.columnName,
    filter: 'agTextColumnFilter',
    editable: false,
    cellStyle: (params) => (params.value === 'ERROR' ? { backgroundColor: '#ff7272', color: '#ff7272' } : null),
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
  const onGridReady = useCallback(
    (params: GridReadyEvent) => {
      const dataSource: IServerSideDatasource = {
        getRows: (prms) => {
          setFilterSetting(prms.request);
          fetchFileContentData({
            id: data.id,
            dataRequest: { ...prms.request },
          })
            .then((res) => {
              if (res.rows) {
                const temprows = res.rows;
                temprows.forEach((e) => {
                  Object.keys(e.errors).forEach((key) => {
                    if (e.errors[key] != null) {
                      e[key] = 'ERROR';
                    }
                  });
                });
                prms.success({
                  rowData: temprows,
                  rowCount: res.count,
                });
              }
              if (res.count > 0) {
                setHide(true);
              }
            })
            .catch((e) => {
              prms.fail();
            });
        },
      };
      params.api!.setServerSideDatasource(dataSource);
    },
    [data],
  );

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
          statusPanel: (pr) => ClickableStatusBarComponent(pr, onBtExport, handleShow),
        },
      ],
    }),
    [],
  );

  const filterSettings = {
    modelName: data?.fileType,
    modelId: data?.id,
    settings: filterSetting,
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <Modal
        show={show}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <NewSharePopup setShow={setShow} filterSetting={filterSettings} />
      </Modal>
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
