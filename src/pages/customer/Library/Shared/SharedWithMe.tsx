import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import { agGridDateFormatter } from 'app/utils/Helpers';
import { useWindowDimensions } from 'app/hooks';
import { fetchSharedFilterData, Filters } from 'services/filtersAPIService';
import { onModalHidden } from 'app/utils/Modal';
import PageWrapper from 'components/PageWrapper';
import SharedDetailCellRenderer from './SharedSubAg';

interface AGGridType {
  createdAt?: string;
  updatedAt?: string;
  id: number;
  title: string;
  modelName?: string;
  owner?:string;
  filterId:number | undefined;
}

function agGridDTO(rows: Array<Filters>): Array<AGGridType> {
  return rows.map((item: Filters) => ({
    id: item.id || -1,
    title: item?.filter?.title || '',
    modelName: item?.filter?.modelName,
    updatedAt: item.updatedAt,
    createdAt: item.createdAt,
    owner: item.filter?.contact.fullName,
    filterId: item.filterId,
  }));
}

const moduleTitle = 'Shared';

function SharedWithMe() {
  const gridRef = useRef<any>();
  const { height, width } = useWindowDimensions();

  const containerStyle = useMemo(
    () => ({ width: '100%', height: '100vh' }),
    [],
  );
  const gridStyle = useMemo(() => ({ height: '600px', width: '100%' }), []);

  const [rowData, setRowData] = useState<any>();

  const onModalHide = useCallback(() => {
    onModalHidden('shareDataModal', () => {
      fetchSharedFilterData();
    });
  }, []);

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: 'File Name',
      field: 'title',
      filter: 'agTextColumnFilter',
      editable: false,
      cellRenderer: 'agGroupCellRenderer',
    },
    {
      headerName: 'Person',
      field: 'owner',
      filter: 'agTextColumnFilter',
      editable: false,
    },
    {
      headerName: 'Model Name',
      field: 'modelName',
      filter: 'agTextColumnFilter',
      editable: false,
    },
    {
      headerName: 'Create On',
      field: 'createdAt',
      filter: 'agTextColumnFilter',
      valueGetter: (params) => agGridDateFormatter(params.data?.createdAt),
      editable: false,
    },
    {
      headerName: 'Updated On',
      field: 'updatedAt',
      filter: 'agTextColumnFilter',
      valueGetter: (params) => agGridDateFormatter(params.data?.updatedAt),
      editable: false,
    },
  ]);

  // SIDE BAR
  const sideBar = useMemo(
    () => ({
      toolPanels: [
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
      flex: 1,
    }),
    [],
  );

  const onGridReady = useCallback((params) => {
    fetchSharedFilterData().then((twoAData) => {
      setRowData(agGridDTO(twoAData));
    });
    onModalHide();
  }, []);

  const onFirstDataRendered = useCallback(() => {
    gridRef.current?.api.sizeColumnsToFit();
  }, []);

  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current?.api.sizeColumnsToFit();
    }
  }, [width, height]);

  // SUB AG-GRID
  const detailCellRenderer = useMemo<any>(() => SharedDetailCellRenderer, []);

  return (
    <PageWrapper pageTitle={moduleTitle} icon="fas fa-user-friends">
      <div style={containerStyle}>
        <div style={gridStyle} className="ag-theme-alpine">
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
            enableCharts
            groupDisplayType="multipleColumns"
            animateRows
            onGridReady={onGridReady}
            onFirstDataRendered={onFirstDataRendered}
            pagination
            masterDetail
            detailCellRenderer={detailCellRenderer}
            detailRowHeight={600}
            paginationPageSize={10}
          />
        </div>
      </div>
    </PageWrapper>
  );
}
export default React.memo(SharedWithMe);
