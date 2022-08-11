import React, {
    useCallback, useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useAppDispatch } from 'app/hooks';
import PageWrapper from 'components/PageWrapper';
import { AggridPagination } from 'components/AggridPagination';
import { PanAGGridType, PanType } from 'services/pansAPIService';
import {
 fetchPans, updatePanRequest, isLoadingSelector, getPans,
} from 'state/pans/pansSlice';
import { toast } from 'react-hot-toast';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { agGridPansDTO } from 'app/utils/Helpers';
import ActionsRenderer from './ActionsRenderer';
import NewPanModal from './NewPanModal';
import EditPanModal from './EditPanModal';

function CustomActionsToolPanel(onRefreshCallback, isFetchLoading, addNewCallback) {
    return (
      <div className="col">
        <div className="row p-2 gap-2 m-1">
          <button
            type="button"
            className="btn btn-sm btn-success px-4 d-flex gap-2 align-items-center justify-content-center flex-wrap"
            onClick={addNewCallback}
          >
            <i className="fa-solid fa-circle-plus" />
            Add New Pan
          </button>
          <button
            type="button"
            className="btn btn-sm btn-info px-4 d-flex gap-2 align-items-center justify-content-center flex-wrap refreshBtn"
            onClick={onRefreshCallback}
          >
            <i
              className={classNames([
                            'fa-solid',
                            'fa-rotate',
                            { 'fa-spin': isFetchLoading },
                        ])}
            />
            Refresh
          </button>
        </div>
      </div>
    );
}

export default function PansPage() {
    const dispatch = useAppDispatch();
    const gridRef = useRef<any>();

    const rows = useSelector(getPans);

    const [panToEdit, setPanToEdit] = useState<PanType | null>(null);
    const [showNewPanModal, setShowNewPanModal] = useState<boolean>(false);

    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
    const [totalPages, setTotalPage] = useState<number>(0);
    const isFetchLoading = useSelector(isLoadingSelector);

    const [currentPage, setCurrentPage] = useState<number>(0);
    const [rowData, setRowData] = useState<PanAGGridType[]>([]);

    const containerStyle = useMemo(() => ({ width: '100%', height: '77vh' }), []);

    const onEditClickCallback = useCallback((e, params) => {
        setPanToEdit(params.data);
    }, []);

    const onRefreshCallback = useCallback(() => {
        dispatch(fetchPans());
    }, []);

    const actionsCellRenderer = useCallback((params) => (
      <ActionsRenderer
        params={params}
        onEditClickCallback={(e) => onEditClickCallback(e, params)}
      />
      ), []);

    const addNewPanCallback = useCallback(() => setShowNewPanModal(true), [showNewPanModal]);

    const [columnDefs, setColumnDefs] = useState([
    {
      headerName: 'Pans Details',
      children: [
          {
              headerName: 'Title',
              field: 'title',
              filter: 'agTextColumnFilter',
              editable: true,
              onCellValueChanged: (event) => {
                  const { title, id } = event.data;
                  if (title) {
                      const payload = { data: { title }, id };
                      dispatch(updatePanRequest({ ...payload }));
                  } else {
                      toast.error('Title cannot be null');
                      onRefreshCallback();
                  }
              },
          },
          {
              headerName: 'PAN',
              field: 'pan',
              filter: 'agTextColumnFilter',
              editable: true,
              onCellValueChanged: (event) => {
                  const { pan, id } = event.data;
                  if (pan) {
                      const payload = { data: { pan }, id };
                      dispatch(updatePanRequest({ ...payload }));
                  } else {
                      toast.error('Pan cannot be null');
                      onRefreshCallback();
                  }
              },
          },
          {
              field: 'actions',
              cellRenderer: actionsCellRenderer,
              editable: false,
              filter: false,
          },
      ],
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
                toolPanel: () => CustomActionsToolPanel(onRefreshCallback, isFetchLoading, addNewPanCallback),
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

    // navigation
  const onPaginationChanged = useCallback(() => {
    if (gridRef.current!.api!) {
      setCurrentPage(gridRef.current!.api.paginationGetCurrentPage() + 1);
      setTotalPage(gridRef.current!.api.paginationGetTotalPages());
    }
  }, []);

  const onFirstDataRendered = useCallback(() => {
    gridRef.current?.api.sizeColumnsToFit();
  }, []);

  const onGridReady = useCallback(
      (params) => {
        dispatch(fetchPans());
      },
      [dispatch],
  );

  useEffect(() => {
      if (rows) {
          setRowData(agGridPansDTO(rows));

          if (gridRef.current?.api) {
              gridRef.current?.api.sizeColumnsToFit();
          }
      }
  }, [rows]);

  const onNewPanelModalClose = useCallback(() => {
      onRefreshCallback();
      setShowNewPanModal(false);
  }, []);

  const onEditPanelModalClose = useCallback(() => {
      onRefreshCallback();
      setPanToEdit(null);
  }, []);

  return (
    <PageWrapper pageTitle="Gstins" icon="fa-solid fa-building">
      <div style={containerStyle}>
        <NewPanModal show={showNewPanModal} onClose={onNewPanelModalClose} />
        <EditPanModal show={panToEdit != null} panData={panToEdit} onClose={onEditPanelModalClose} />
        <div style={gridStyle} className="ag-theme-alpine">
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            sideBar={sideBar}
            rowSelection="multiple"
            rowDragManaged
            rowDragMultiRow
            rowGroupPanelShow="always"
            defaultColDef={defaultColDef}
            groupDisplayType="multipleColumns"
            animateRows
            onGridReady={onGridReady}
            icons={icons}
            paginationPageSize={10}
            pagination
            suppressPaginationPanel
            suppressScrollOnNewData
            onPaginationChanged={onPaginationChanged}
            onFirstDataRendered={onFirstDataRendered}
            enableRangeSelection
            masterDetail
          />
          <AggridPagination
            gridRef={gridRef}
            totalPages={totalPages}
            currentPage={currentPage}
          />
        </div>

      </div>
    </PageWrapper>
  );
}
