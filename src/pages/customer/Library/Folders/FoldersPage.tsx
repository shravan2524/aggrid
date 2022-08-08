import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import { onModalHidden, showModal } from 'app/utils/Modal';
import { useWindowDimensions } from 'app/hooks';
import PageWrapper from 'components/PageWrapper';
import { ICellRendererParams } from 'ag-grid-community';
import { agGridDateFormatter } from 'app/utils/Helpers';
import 'components/Library/style.scss';
import { fetchFoldersData, Folders } from 'services/FolderAPIService';
import classNames from 'classnames';
import SaveFolderModal from 'components/Library/CreateFolder';
import FolderFiltersDetailCellRenderer from './FolderFiltersSuAg';

const moduleTitle = 'Folders';

type ActionsRendererProps = {
  params: ICellRendererParams;
  onEditClickCallback: (params: ICellRendererParams) => void;
};

function ActionsRenderer({
  params,
  onEditClickCallback,
}: ActionsRendererProps) {
  return (
    <div className="d-flex justify-content-around align-items-center w-100 h-100">
      <button
        type="button"
        onClick={() => onEditClickCallback(params)}
        className="btn btn-sm btn-primary text-success"
      >
        <i className="fa-solid fa-pen-to-square" />
      </button>
      <button
        type="button"
        className="btn btn-sm btn-danger"
      >
        <i className="fas fa-trash" />
      </button>
    </div>
  );
}

function CustomActionsToolPanel(isLoading, onRefreshCallback) {
  return (
    <div className="col">
      <div className="row p-2 gap-2 m-1">
        <button
          type="button"
          onClick={() => showModal('saveFolderModal')}
          className="btn btn-sm btn-success px-4 d-flex gap-2 align-items-center justify-content-center flex-wrap"
        >
          <i className="fas fa-folder-plus" />
          Create Folder
        </button>

        <button
          type="button"
          onClick={onRefreshCallback}
          className="btn btn-sm px-4 d-flex gap-2 align-items-center justify-content-center flex-wrap refreshBtn"
        >
          <i
            className={classNames([
              'fa-solid',
              'fa-rotate',
              { 'fa-spin': isLoading },
            ])}
          />
          Refresh
        </button>
      </div>
    </div>
  );
}

function FoldersPage() {
  const gridRef = useRef<any>();
  const [rowData, setRowData] = useState<any>();
  const { height, width } = useWindowDimensions();
  const [itemData, setItemData] = useState<Folders | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const containerStyle = useMemo(
    () => ({ width: '100%', height: '100vh' }),
    [],
  );
  const gridStyle = useMemo(() => ({ height: '800px', width: '100%' }), []);

  const onfetchData = () => {
    setIsLoading(true);
    fetchFoldersData()
      .then((twoAData) => {
        setIsLoading(false);
        setRowData(twoAData);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const onModalHide = useCallback(() => {
    onModalHidden('saveFolderModal', () => {
      setItemData(null);
      onfetchData();
    });
  }, []);

  const onRefreshCallback = useCallback((params) => {
    onfetchData();
  }, []);

  const onEditClickCallback = useCallback((params) => {
    setItemData(params.data);
    showModal('saveFolderModal');
  }, []);

  const ActionsRendererCb = useCallback(
    (params) => (
      <ActionsRenderer
        params={params}
        onEditClickCallback={onEditClickCallback}
      />
    ),
    [],
  );

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: 'Folder Name',
      field: 'title',
      filter: 'agTextColumnFilter',
      editable: false,
      cellRenderer: 'agGroupCellRenderer',
    },
    {
      headerName: 'Created On',
      field: 'createdAt',
      filter: 'agTextColumnFilter',
      valueGetter: (params) => agGridDateFormatter(params.data?.createdAt),
    },
    {
      headerName: 'Updated On',
      field: 'updatedAt',
      filter: 'agTextColumnFilter',
      valueGetter: (params) => agGridDateFormatter(params.data?.updatedAt),
      editable: false,
    },
    {
      field: 'actions',
      cellRenderer: ActionsRendererCb,
      editable: false,
      filter: false,
      cellStyle: (params) => {
        if (params.value === 'Actions') {
          // mark police cells as red
          return { width: '100%', height: '100%' };
        }
        return null;
      },
    },
  ]);

  const icons = useMemo<{ [key: string]: Function | string }>(
    () => ({
      'custom-actions-tool': '<i class="fa-solid fa-screwdriver-wrench"></i>',
    }),
    [],
  );

  const sideBar = useMemo(
    () => ({
      toolPanels: [
        {
          id: 'customActionsTool',
          labelDefault: 'Actions',
          labelKey: 'customActionsTool',
          iconKey: 'custom-actions-tool',
          toolPanel: () => CustomActionsToolPanel(isLoading, onRefreshCallback),
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
      defaultToolPanel: 'customActionsTool',
    }),
    [isLoading],
  );

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

  const onFirstDataRendered = useCallback(() => {
    gridRef.current?.api.sizeColumnsToFit();
  }, []);

  const onGridReady = useCallback((params) => {
    onfetchData();
    onModalHide();
  }, []);

  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current?.api.sizeColumnsToFit();
    }
  }, [width, height]);

  // SUB AG-GRID
  const detailCellRenderer = useMemo<any>(
    () => FolderFiltersDetailCellRenderer,
    [],
  );

  return (
    <PageWrapper pageTitle={moduleTitle} icon="fas fa-folder-plus">
      <div style={containerStyle}>
        <div style={gridStyle} className="ag-theme-alpine">
          <SaveFolderModal itemData={itemData} />
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            sideBar={sideBar}
            rowDragManaged
            rowDragMultiRow
            rowGroupPanelShow="always"
            defaultColDef={defaultColDef}
            groupDisplayType="multipleColumns"
            animateRows
            onGridReady={onGridReady}
            icons={icons}
            pagination
            detailCellRenderer={detailCellRenderer}
            onFirstDataRendered={onFirstDataRendered}
            masterDetail
            detailRowHeight={600}
            paginationPageSize={10}
          />
        </div>
      </div>
    </PageWrapper>
  );
}
export default React.memo(FoldersPage);
