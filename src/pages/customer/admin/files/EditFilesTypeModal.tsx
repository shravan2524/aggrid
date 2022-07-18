import React, {
  useCallback,
  useEffect, useMemo, useRef, useState,
} from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import classNames from 'classnames';
import { useAppDispatch } from 'app/hooks';
import CustomButton from 'components/CustomButton';
import { useSelector } from 'react-redux';
import { isPutLoadingSelector, setContentTypeRequest } from 'state/files/filesSlice';
import { toast } from 'react-hot-toast';
import { AgGridReact } from 'ag-grid-react';
import { onModalHidden, onModalShown } from 'app/utils/Modal';

interface EditFilesTypeFormProps {
  type: string;
}

interface EditFilesTypeModalProps {
  selectedRows: any[];
}

export default function EditFilesTypeModal({ selectedRows }: EditFilesTypeModalProps) {
  const gridRef = useRef<any>();
  const [rowData, setRowData] = useState<any>();
  const [isModalShown, setIsModalShown] = useState<boolean>();

  const dispatch = useAppDispatch();
  const isLoading = useSelector(isPutLoadingSelector);
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: 'File Name',
      field: 'fileName',
      filter: 'agTextColumnFilter',
      editable: false,
    },
    {
      headerName: 'File Type',
      field: 'fileType',
      filter: 'agTextColumnFilter',
      editable: false,
    },
  ]);
  const modalId = useMemo(() => 'editFilesTypeModal', []);

  const containerStyle = useMemo(() => ({
    width: '100%',
    height: '350px !important',

  }), []);

  const availableFilesTypes = useMemo(() => ([
    {
      type: 'invoicePdf',
      label: 'Invoice PDF',
    },
    {
      type: '2A',
      label: '2A',
    },
    {
      type: '2B',
      label: '2B',
    },
    {
      type: 'PR',
      label: 'PR',
    },
  ]), []);

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
    if (gridRef.current?.api) {
      gridRef.current?.api.sizeColumnsToFit();
    }
  }, []);

  const schema = yup.object({
    type: yup.string().required(),
  }).required();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditFilesTypeFormProps>({
    resolver: yupResolver(schema),
  });

  // Effects ...
  useEffect(() => {
    if (rowData) {
      if (gridRef.current?.api) {
        gridRef.current?.api.sizeColumnsToFit();
      }
    }
  }, [rowData]);

  useEffect(() => {
    setRowData(selectedRows);

    if (gridRef.current?.api) {
      gridRef.current?.api.sizeColumnsToFit();
    }
  }, [selectedRows]);

  const onSubmit = ({ type }: EditFilesTypeFormProps) => {
    selectedRows.forEach((sr) => {
      const payload = {
        data: { fileType: type },
        id: sr?.id,
      };
      dispatch(setContentTypeRequest({ ...payload })).then(() => toast.success('File Successfully Updated !'));
    });
  };

  const onModalShownCached = useCallback(() => onModalShown(modalId, () => {
    setIsModalShown(true);
  }), []);

  const onModalHiddenCached = useCallback(() => onModalHidden(modalId, () => {
    setIsModalShown(false);
  }), []);

  useEffect(() => {
    onModalShownCached();
    onModalHiddenCached();
  }, []);

  return (
    <div className="modal fade" id={modalId} aria-labelledby={`new${modalId}Label`} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-header">
              <h5 className="modal-title" id={`new${modalId}Label`}>Change Files Type</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              {isModalShown && (
                <div className=" ag-theme-alpine grid-container-style">
                  <AgGridReact
                    ref={gridRef}
                    containerStyle={containerStyle}
                    rowData={rowData}
                    animateRows
                    pagination
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    onFirstDataRendered={onFirstDataRendered}
                    colResizeDefault="shift"
                  />
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="customer" className="col-form-label">Available File Types:</label>
                <select
                  {...register('type')}
                  className={classNames(['form-select form-select-sm', { 'is-invalid': errors.type }])}
                >
                  <option value="">Please select File type ...</option>
                  {availableFilesTypes && availableFilesTypes.map((option) => (
                    <option key={option.type} value={option.type}>{option.label}</option>
                  ))}
                </select>

                {errors.type && (
                <div id="validationTitleFeedback" className="invalid-feedback">
                  <p>{errors.type?.message}</p>
                </div>
                )}
              </div>

            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-sm btn-danger" data-bs-dismiss="modal">
                Close
              </button>
              <CustomButton
                isLoading={isLoading}
                isSubmit
                className="btn btn-sm btn-primary"
              >
                Update
              </CustomButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
