import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import { onModalHidden, showModal } from 'app/utils/Modal';
import { useAppDispatch, useWindowDimensions } from 'app/hooks';
import PageWrapper from 'components/PageWrapper';
import {
  readAll, isLoadingSelector, readAllSelector,
} from 'state/users/slice';
import { ItemType as UserType } from 'services/users';
import { useSelector } from 'react-redux';
import { ICellRendererParams } from 'ag-grid-community';
import classNames from 'classnames';
import { readAllSelector as rolesReadAllSelector } from 'state/roles/slice';
import { agGridDateFormatter } from 'app/utils/Helpers';
import StatusFilter from './UsersAgGridStatusFilter';
import SaveFormModal from './SaveFormModal';

const moduleName = 'User';
const moduleTitle = 'Users';
const modalIdentifier = `save${moduleName}Modal`;

interface AGGridType {
  id: number,
  email: string,
  fullName?: string,
  updatedAt?: Date,
  updator?: any,
  status?: string,
  roles?: Array<number>,
}

function agGridDTO(rows: Array<UserType>): Array<AGGridType> {
  return rows.map(
    (item: UserType) => ({
      id: item.id || -1,
      email: item?.contact?.email || '',
      fullName: item?.contact?.fullName,
      status: item.status,
      updatedAt: item.updatedAt,
      updator: item.updator,
      roles: item.roles || [],
    }),
  );
}

type ActionsRendererProps = {
  params: ICellRendererParams;
  onEditClickCallback: (e: React.MouseEvent<HTMLButtonElement>, params: ICellRendererParams) => void;
};

function ActionsRenderer({ params, onEditClickCallback }: ActionsRendererProps) {
  return (
    <div className="d-flex justify-content-around align-items-center w-100 h-100">
      <button type="button" className="btn btn-sm btn-light" onClick={(e) => onEditClickCallback(e, params)}>
        <i className="fa-solid fa-pen-to-square" />
        {' '}
        Edit
      </button>
    </div>
  );
}

function CustomActionsToolPanel(onRefreshCallback, isFetchLoading) {
  return (
    <div className="col">
      <div className="row p-2 gap-2 m-1">
        <button
          type="button"
          className="btn btn-sm btn-danger px-4 d-flex gap-2 align-items-center justify-content-center flex-wrap"
          onClick={() => showModal(modalIdentifier)}
        >
          <i className="fa-solid fa-circle-plus" />
          Add New
          {' '}
          {moduleName}
        </button>

        <button
          type="button"
          className="btn btn-sm btn-info px-4 d-flex gap-2 align-items-center justify-content-center flex-wrap"
          onClick={onRefreshCallback}
        >
          <i className={classNames(['fa-solid', 'fa-rotate', { 'fa-spin': isFetchLoading }])} />
          Refresh
        </button>
      </div>
    </div>
  );
}

interface RolesRendererProps {
  data: any,
}

function RolesRenderer(props: RolesRendererProps) {
  const allRoles = useSelector(rolesReadAllSelector);

  if (!allRoles) {
    return null;
  }

  const { data } = props;
  const roles = data.value || [];

  if (roles.length === 0 || allRoles.length === 0) {
    return null;
  }

  const result = roles.map((r: string, idx: number) => {
    const i = parseInt(r, 10);
    const ar = allRoles.find((x) => x.id === i);
    if (!ar) {
      return null;
    }

    return { key: idx, title: ar.title };
  }).filter((x) => x !== null);

  return (
    <div>
      {
        result.map((i, idx) => (
          <span key={i?.key}>
            {i?.title}
            {(idx < result.length - 1) && ' | '}
          </span>
        ))
      }
    </div>
  );
}

function Page() {
  const dispatch = useAppDispatch();
  const gridRef = useRef<any>();
  const [rowData, setRowData] = useState<any>();
  const { height, width } = useWindowDimensions();
  const rows = useSelector(readAllSelector);
  const [itemData, setItemData] = useState<UserType | null>(null);
  const isFetchLoading = useSelector(isLoadingSelector);
  const allRoles = useSelector(rolesReadAllSelector);

  const containerStyle = useMemo(() => ({
    width: '100%',
    height: `${(height)}px`,
    minHeight: '600px',
  }), [height, width]);

  const onModalHide = useCallback(() => {
    onModalHidden(`save${moduleName}Modal`, () => {
      setItemData(null);
      dispatch(readAll());
      console.log('hi');
    });
  }, []);

  const onEditClickCallback = useCallback(
    (e, params) => {
      setItemData(params.data);
      showModal(`save${moduleName}Modal`);
    },
    [],
  );

  const RolesRendererCb = useCallback(
    (params) => (<RolesRenderer data={params} />),
    [],
  );

  const ActionsRendererCb = useCallback(
    (params) => (
      <ActionsRenderer
        params={params}
        onEditClickCallback={(e) => onEditClickCallback(e, params)}
      />
    ),
    [],
  );

  const statusCellClass = useCallback(
    (params) => {
      const { data } = params;

      if (data.status === 'deactivated') {
        return ['bg-danger text-white'];
      }

      if (data.status === 'invited') {
        return ['bg-warning'];
      }

      return [];
    },
    [],
  );

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: `${moduleTitle} Details`,
      children: [
        {
          headerName: 'Name',
          field: 'fullName',
          filter: 'agTextColumnFilter',
          editable: false,
        },
        {
          headerName: 'E-mail',
          field: 'email',
          filter: 'agTextColumnFilter',
        },
        {
          headerName: 'Status',
          field: 'status',
          cellClass: statusCellClass,
          editable: false,
          filter: StatusFilter,
          floatingFilter: false,
        },
        {
          headerName: 'Roles',
          field: 'roles',
          cellRenderer: RolesRendererCb,
          filter: false,
          editable: false,
        },
        {
          headerName: 'Updated At',
          field: 'updatedAt',
          filter: 'agNumberColumnFilter',
          valueGetter: agGridDateFormatter,
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
      ],
    },
  ]);

  const icons = useMemo<{ [key: string]: Function | string; }>(() => ({
    'custom-actions-tool': '<i class="fa-solid fa-screwdriver-wrench"></i>',
  }), []);

  function upDate() {
    dispatch(readAll);
  }
  const onRefreshCallback = useCallback(
    (params) => {
      dispatch(readAll());
    },
    [],
  );

  const sideBar = useMemo(() => ({
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
    defaultToolPanel: 'customActionsTool',
  }), [isFetchLoading]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: true,
    enableRowGroup: true,
    editable: true,
    enablePivot: true,
    enableValue: true,
  }), []);

  const onFirstDataRendered = useCallback(() => {
    gridRef.current?.api.sizeColumnsToFit();
  }, []);

  const onGridReady = useCallback((params) => {
    dispatch(readAll());
    onModalHide();
  }, []);

  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current?.api.sizeColumnsToFit();
    }
  }, [width, rows]);

  useEffect(() => {
    setRowData(agGridDTO(rows));

    if (gridRef.current?.api) {
      gridRef.current?.api.sizeColumnsToFit();
    }
  }, [rows]);

  if (!allRoles) {
    return null;
  }

  return (
    <PageWrapper pageTitle={moduleTitle} icon="fa-solid fa-building">
      <div className=" ag-theme-alpine grid-container-style">

        <SaveFormModal itemData={itemData} modalIdentifier={modalIdentifier} />
        <AgGridReact
          containerStyle={containerStyle}
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
          pagination
          onFirstDataRendered={onFirstDataRendered}
          enableRangeSelection
          masterDetail
        />

      </div>

    </PageWrapper>
  );
}

export default React.memo(Page);
