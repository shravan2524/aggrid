import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import { onModalHidden, showModal } from 'app/utils/Modal';
import './users.css';
import { useAppDispatch, useWindowDimensions } from 'app/hooks';
import PageWrapper from 'components/PageWrapper';
import { readAll, isLoadingSelector, readAllSelector } from 'state/users/slice';
import {
  ActivateUser,
  DeactivateUser,
  DeleteUser,
  ItemType as UserType,
} from 'services/users';
import { useSelector } from 'react-redux';
import { ICellRendererParams } from 'ag-grid-community';
import classNames from 'classnames';
import { readAllSelector as rolesReadAllSelector, readAll as readAllRoles } from 'state/roles/slice';
import { agGridDateFormatter } from 'app/utils/Helpers';
import Switch from 'react-switch';
import toast from 'react-hot-toast';
import SaveFormModal from './SaveFormModal';

const moduleName = 'User';
const moduleTitle = 'Users';
const modalIdentifier = `save${moduleName}Modal`;

interface AGGridType {
  id: number;
  email: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  updatedAt?: Date;
  updator?: any;
  status?: string;
  roles?: Array<number>;
}

function agGridDTO(rows: Array<UserType>): Array<AGGridType> {
  return rows.map((item: UserType) => ({
    id: item.id || -1,
    email: item?.contact?.email || '',
    fullName: item?.contact?.fullName,
    firstName: item?.contact?.firstName,
    lastName: item?.contact?.lastName,
    status: item.status,
    updatedAt: item.updatedAt,
    updator: item.updator,
    roles: item.roles || [],
  }));
}

type ActionsRendererProps = {
  params: ICellRendererParams;
  onEditClickCallback: (params: ICellRendererParams) => void;
  onDeleteUser: (params: ICellRendererParams) => void;
};

function ActionsRenderer({
  params,
  onDeleteUser,
  onEditClickCallback,
}: ActionsRendererProps) {
  const { data } = params;
  const [checked, setChecked] = useState(false);
  const rows = useSelector(readAllSelector);

  const handleChange = (e) => {
      if (e === true) {
        setChecked(true);
        ActivateUser(data?.id).then(() => {
          toast.success('User Activated');
        });
      }
      if (e === false) {
        setChecked(false);
        DeactivateUser(data?.id).then(() => {
          toast.success('User Deactivated');
        });
      }
  };

  useEffect(() => {
    if (data?.status === 'active') {
      setChecked(true);
    }
  }, [data, rows]);

  return (
    <div className="d-flex justify-content-around align-items-center w-100 h-100">
      <Switch
        onChange={handleChange}
        checked={checked}
        height={20}
        width={35}
        uncheckedIcon={false}
        checkedIcon={false}
        disabled={data?.status === 'invited'}
        className="react-switch"
      />

      <button
        type="button"
        className="btn btn-sm btn-primary"
        onClick={(e) => onEditClickCallback(params)}
      >
        <i className="fa-solid fa-pen-to-square" />
      </button>
      <button
        onClick={(e) => onDeleteUser(params)}
        type="button"
        className="btn btn-sm btn-danger"
      >
        <i className="fas fa-trash-alt" />
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
          className="btn btn-sm btn-success px-4 d-flex gap-2 align-items-center justify-content-center flex-wrap"
          onClick={() => showModal(modalIdentifier)}
        >
          <i className="fa-solid fa-circle-plus" />
          Add New
          {' '}
          {moduleName}
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

interface RolesRendererProps {
  data: any;
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

  const result = roles
    .map((r: string, idx: number) => {
      const i = parseInt(r, 10);
      const ar = allRoles.find((x) => x.id === i);
      if (!ar) {
        return null;
      }

      return { key: idx, title: ar.title };
    })
    .filter((x) => x !== null);

  return (
    <div>
      {result.map((i, idx) => (
        <span key={i?.key}>
          {i?.title}
          {idx < result.length - 1 && ' | '}
        </span>
      ))}
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

  const containerStyle = useMemo(
    () => ({
      width: '100%',
      height: `${height}px`,
      minHeight: '600px',
    }),
    [height, width],
  );

  const onRefreshCallback = useCallback((params) => {
    dispatch(readAll());
  }, []);

  const onModalHide = useCallback(() => {
    onModalHidden(`save${moduleName}Modal`, () => {
      setItemData(null);
      dispatch(readAll());
    });
  }, []);

  const onEditClickCallback = useCallback((params) => {
    setItemData(params.data);
    showModal(`save${moduleName}Modal`);
  }, []);

  const onDeleteUser = useCallback((params) => {
    if (window.confirm(`${params.data?.fullName} Will be deleted`)) {
      DeleteUser(params.data?.id).then(() => {
        dispatch(readAll());
      });
    }
  }, []);

  const RolesRendererCb = useCallback(
    (params) => <RolesRenderer data={params} />,
    [],
  );

  const ActionsRendererCb = useCallback(
    (params) => (
      <ActionsRenderer
        params={params}
        onDeleteUser={() => onDeleteUser(params)}
        onEditClickCallback={() => onEditClickCallback(params)}
      />
    ),
    [],
  );

  const [columnDefs, setColumnDefs] = useState([
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
          headerName: 'Roles',
          field: 'roles',
          cellRenderer: RolesRendererCb,
          filter: false,
          editable: false,
        },
        {
          headerName: 'Updated On',
          field: 'updatedAt',
          filter: 'agNumberColumnFilter',
          valueGetter: (params) => (agGridDateFormatter(params.data?.updatedAt)),
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

  const onFirstDataRendered = useCallback(() => {
    gridRef.current?.api.sizeColumnsToFit();
  }, []);

  const onGridReady = useCallback((params) => {
    dispatch(readAll());
    dispatch(readAllRoles());
    onModalHide();
  }, []);

  useEffect(() => {
    setRowData(agGridDTO(rows));

    if (gridRef.current?.api) {
      gridRef.current?.api.sizeColumnsToFit();
    }
  }, [width, rows]);

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
          // rowSelection="multiple"
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
          // enableRangeSelection
          masterDetail
        />
      </div>
    </PageWrapper>
  );
}

export default React.memo(Page);
