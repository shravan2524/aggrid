import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import { onModalHidden, showModal } from 'app/utils/Modal';
import { useAppDispatch, useGstins, useWindowDimensions } from 'app/hooks';
import PageWrapper from 'components/PageWrapper';
import {
  fetchGstins,
  updateGstinRequest,
  isLoadingSelector,
} from 'state/gstins/gstinsSlice';
import { agGridGstinsDTO } from 'app/utils/Helpers';
import { GstinsType } from 'services/gstinsAPIService';
import { useSelector } from 'react-redux';
import { availableTenants } from 'state/tenants/tenantsSlice';
import { ICellRendererParams } from 'ag-grid-community';
import classNames from 'classnames';
import { toast } from 'react-hot-toast';
import { AggridPagination } from 'components/AggridPagination';
import NewGstinModal from './NewGstinModal';
import EditGstinModal from './EditGstinModal';
import GstinCredentialsModal from './GstinCredentialsModal';

type ActionsRendererProps = {
  params: ICellRendererParams;
  onEditClickCallback: (
    e: React.MouseEvent<HTMLButtonElement>,
    params: ICellRendererParams
  ) => void;
  onCredentialsClickCallback: (
    e: React.MouseEvent<HTMLButtonElement>,
    params: ICellRendererParams
  ) => void;
};

function ActionsRenderer({
  params,
  onEditClickCallback,
  onCredentialsClickCallback,
}: ActionsRendererProps) {
  return (
    <div className="d-flex align-items-center w-100 h-100">
      <button
        type="button"
        className="btn btn-sm btn-primary "
        onClick={(e) => onEditClickCallback(e, params)}
      >
        <i className="fa-solid fa-pen-to-square" />
        {' '}
        Edit
      </button>
      {params.data.gstin !== '' && (
        <button
          type="button"
          className="btn btn-sm btn-danger ml-4"
          onClick={(e) => onCredentialsClickCallback(e, params)}
        >
          <i className="fa-solid fa-key" />
          {' '}
          Credentials
        </button>
      )}
    </div>
  );
}

function CustomActionsToolPanel(onRefreshCallback, isFetchLoading) {
  return (
    <div className="col">
      <div className="row p-2 gap-2 m-1">
        <button
          type="button"
          className="btn btn-sm btn-success d-flex gap-1 align-items-center justify-content-center flex-wrap"
          onClick={() => showModal('newGstinModal')}
        >
          <i className="fa-solid fa-circle-plus" />
          Add Gstin
        </button>
        <button
          type="button"
          className="btn btn-sm d-flex gap-1 align-items-center justify-content-center flex-wrap refreshBtn"
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

function ParentRenderer(params) {
  let result = '---';

  try {
    const parentId = params.data.parent;
    params.api.forEachNode((rowNode) => {
      if (rowNode.data.id.toString() === parentId.toString()) {
        result = rowNode.data.name;
      }
    });

    return result;
  } catch (e) {
    return result;
  }
}

export default function GstinsPage() {
  const dispatch = useAppDispatch();
  const gridRef = useRef<any>();
  const { height, width } = useWindowDimensions();
  const [rowData, setRowData] = useState<any[]>([]);
  const [totalPages, setTotalPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const anyCustomer = useSelector(availableTenants);
  const rows: any = useGstins();
  const [gstinData, setgstinData] = useState<GstinsType | null>(null);
  const isFetchLoading = useSelector(isLoadingSelector);
  const containerStyle = useMemo(
    () => ({ width: '100%', height: '100vh' }),
    [],
  );
  const gridStyle = useMemo(() => ({ height: '500px', width: '100%' }), []);

  const onEditClickCallback = (e, params) => {
    setgstinData(params.data);
    showModal('editgstinModal', () => {
      setgstinData(null);
    });
  };

  const onCredentialsClickCallback = (e, params) => {
    setgstinData(params.data);
    showModal('editCredentialsGstinModal', () => {
      setgstinData(null);
    });
  };

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: 'Gstins Details',
      children: [
        {
          headerName: 'ID',
          field: 'id',
          filter: 'agNumberColumnFilter',
          editable: false,
        },
        {
          headerName: 'GSTIN',
          field: 'gstin',
          filter: 'agNumberColumnFilter',
          onCellValueChanged: (event) => {
            const { gstin, id } = event.data;
            const isValidGSTIN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstin);
            if (isValidGSTIN) {
              const payload = { data: { gstin }, id };
              dispatch(updateGstinRequest({ ...payload }));
            } else {
              toast.error('Invalid GSTIN Format');
            }
          },
        },
        {
          headerName: 'Name',
          field: 'name',
          filter: 'agTextColumnFilter',
          onCellValueChanged: (event) => {
            const { name, id } = event.data;
            const payload = { data: { name }, id };
            dispatch(updateGstinRequest({ ...payload }));
          },
        },
        {
          headerName: 'Parent',
          field: 'parent',
          filter: 'agNumberColumnFilter',
          valueGetter: ParentRenderer,
          editable: false,
        },
        {
          field: 'actions',
          // eslint-disable-next-line react/no-unstable-nested-components
          cellRenderer: (params) => (
            <ActionsRenderer
              params={params}
              onEditClickCallback={(e) => onEditClickCallback(e, params)}
              onCredentialsClickCallback={(e) => onCredentialsClickCallback(e, params)}
            />
          ),
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
      ],
    },
  ]);

  const icons = useMemo<{ [key: string]: Function | string }>(
    () => ({
      'custom-actions-tool': '<i class="fa-solid fa-screwdriver-wrench"></i>',
    }),
    [],
  );

  const onRefreshCallback = useCallback(() => {
    dispatch(fetchGstins());
  }, []);

  const sideBar = useMemo(
    () => ({
      toolPanels: [
        {
          id: 'customActionsTool',
          labelDefault: 'Actions',
          labelKey: 'customActionsTool',
          iconKey: 'custom-actions-tool',
          toolPanel: () => CustomActionsToolPanel(onRefreshCallback, isFetchLoading),
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
    [isFetchLoading],
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

  const onNewgstinHiddenCache = useCallback(
    () => onModalHidden('newGstinModal', () => dispatch(fetchGstins())),
    [],
  );

  useEffect(() => {
    onNewgstinHiddenCache();
    if (rows.length) {
      setRowData(agGridGstinsDTO(rows));
    }
    if (gridRef.current?.api) {
      gridRef.current?.api.sizeColumnsToFit();
    }
  }, [width, rows]);

  if (!anyCustomer) {
    return (
      <PageWrapper pageTitle="Gstins" icon="fa-solid fa-building">
        <div className="col">
          <div className="alert alert-info" role="alert">
            You have no Workspaces set, please set first at less one Workspace
            in order to use Gstins .
          </div>
        </div>
      </PageWrapper>
    );
  }

  // navigation
  const onPaginationChanged = () => {
    if (gridRef.current!.api!) {
      setCurrentPage(gridRef.current!.api.paginationGetCurrentPage() + 1);
      setTotalPage(gridRef.current!.api.paginationGetTotalPages());
    }
  };

  return (
    <PageWrapper pageTitle="Gstins" icon="fa-solid fa-building">
      <div style={containerStyle}>
        <NewGstinModal />
        <EditGstinModal gstinData={gstinData} />
        <GstinCredentialsModal gstinData={gstinData} />
        <div style={gridStyle} className="ag-theme-alpine">
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            sideBar={sideBar}
            // rowSelection="multiple"
            rowDragManaged
            rowDragMultiRow
            rowGroupPanelShow="always"
            defaultColDef={defaultColDef}
            groupDisplayType="multipleColumns"
            animateRows
            icons={icons}
            paginationPageSize={10}
            pagination
            suppressPaginationPanel
            suppressScrollOnNewData
            onPaginationChanged={onPaginationChanged}
            // enableRangeSelection
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
