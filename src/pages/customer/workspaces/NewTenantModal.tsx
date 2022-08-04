import React, { useEffect, useMemo } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'app/hooks';
import CustomButton from 'components/CustomButton';
import { v4 as uuidv4 } from 'uuid';
import { hideModal } from 'app/utils/Modal';
import {
  fetchTenants, isPostLoadingSelector, newTenantRequest,
} from 'state/tenants/tenantsSlice';
import toast from 'react-hot-toast';

interface NewTenantFormProps {
  title: string;
}

export default function NewTenantModal() {
  const dispatch = useAppDispatch();
  const isLoading = useSelector(isPostLoadingSelector);

  const modalId = useMemo(() => 'newTenantModal', []);

  const schema = yup.object({
    title: yup.string().required(),
  }).required();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewTenantFormProps>({
    resolver: yupResolver(schema),
  });

  const onSubmit = ({ title }: NewTenantFormProps) => {
    const body = { title, uuid: uuidv4() };
    dispatch(newTenantRequest(body)).then(() => {
      toast.success('Workspace successfully created.');
    });
  };

  useEffect(() => {
    reset({ title: '' });
    dispatch(fetchTenants()).then(() => {
      hideModal(modalId);
    });
  }, [isLoading]);

  return (
    <div className="modal fade" id={modalId} aria-labelledby={`new${modalId}Label`} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-header">
              <h5 className="modal-title" id={`new${modalId}Label`}>Add New Workspace</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">

              <div className="mb-3">
                <label htmlFor="name" className="col-form-label">Title:</label>
                <input
                  {...register('title')}
                  id="title"
                  className={classNames(['form-control form-control-sm', { 'is-invalid': errors.title }])}
                  placeholder="Enter Workspace name ..."
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
                Save
              </CustomButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
