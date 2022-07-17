import React, { useEffect, useMemo } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'app/hooks';
import CustomButton from 'components/CustomButton';
import {
  fetchTenants,
  isPutLoadingSelector, updateTenantRequest,
} from 'state/tenants/tenantsSlice';
import { hideModal } from 'app/utils/Modal';
import { TenantType } from 'services/tenantsAPIService';

interface EditTenantFormProps {
  title: string;
}

interface EditTenantModalProps {
  tenantToEdit: TenantType | null;
}
export default function EditTenantModal({ tenantToEdit }: EditTenantModalProps) {
  const dispatch = useAppDispatch();
  const isLoading = useSelector(isPutLoadingSelector);

  const modalId = useMemo(() => 'editTenantModal', []);

  const schema = yup.object({
    title: yup.string().required(),
  }).required();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditTenantFormProps>({
    resolver: yupResolver(schema),
  });

  const onSubmit = ({ title }: EditTenantFormProps) => {
    const payload = { data: { title }, id: tenantToEdit?.id };
    dispatch(updateTenantRequest({ ...payload }));
  };

  useEffect(() => {
    dispatch(fetchTenants()).then(() => {
      hideModal(modalId);
    });
  }, [isLoading]);

  useEffect(() => {
    reset({ title: tenantToEdit?.title });
  }, [tenantToEdit]);

  return (
    <div className="modal fade" id={modalId} aria-labelledby={`new${modalId}Label`} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-header">
              <h5 className="modal-title" id={`new${modalId}Label`}>Edit Workspace</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">

              <div className="mb-3">
                <label htmlFor="title" className="col-form-label">Title:</label>
                <input
                  {...register('title')}
                  id="title"
                  className={classNames(['form-control form-control-sm', { 'is-invalid': errors.title }])}
                  placeholder="Enter Workspace title ..."
                />
                {errors.title && (
                  <div id="validationTitleFeedback" className="invalid-feedback">
                    <p>{errors.title?.message}</p>
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
