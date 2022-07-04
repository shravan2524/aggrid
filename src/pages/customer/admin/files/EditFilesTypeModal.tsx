import React, { useMemo } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import classNames from 'classnames';
import { useAppDispatch } from 'app/hooks';
import CustomButton from 'components/CustomButton';
import { useSelector } from 'react-redux';
import { isPutLoadingSelector, updateFileRequest } from 'state/files/filesSlice';
import { toast } from 'react-hot-toast';

interface EditFilesTypeFormProps {
  type: string;
}

interface EditFilesTypeModalProps {
  selectedRows: any[];
}
export default function EditFilesTypeModal({ selectedRows }: EditFilesTypeModalProps) {
  const dispatch = useAppDispatch();

  const isLoading = useSelector(isPutLoadingSelector);
  const modalId = useMemo(() => 'editFilesTypeModal', []);

  const availableFilesTypes = useMemo(() => ([
    {
      type: 'invoicePdf',
      label: 'Invoice Pdf',
    },
    {
      type: '2A',
      label: '2A',
    },
    {
      type: 'PR',
      label: 'PR',
    },
  ]), []);

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

  const onSubmit = ({ type }: EditFilesTypeFormProps) => {
    selectedRows.forEach((sr) => {
      const payload = {
        data: { type },
        id: sr?.id,
      };
      dispatch(updateFileRequest({ ...payload })).then(() => toast.success('File Successfully Updated !'));
    });
  };

  return (
    <div className="modal fade" id={modalId} aria-labelledby={`new${modalId}Label`} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-header">
              <h5 className="modal-title" id={`new${modalId}Label`}>Change Files Type</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">

              {selectedRows.map((sr, i) => (
                <>
                  <div key={sr.id} className="row gy-3">
                    <div className="col-md-6">
                      <p className="m-0 p-0 text-small text-muted">File Name: </p>
                      <p className="text-small">{sr.fileName}</p>
                    </div>
                    <div className="col-md-6">
                      <p className="m-0 p-0 text-small text-muted">File Type:</p>
                      <p className="text-small">{sr.fileType}</p>
                    </div>
                  </div>
                  <hr className="my-1" />
                </>
              ))}

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
