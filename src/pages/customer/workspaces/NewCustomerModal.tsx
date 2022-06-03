import React, { useEffect, useMemo } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'app/hooks';
import CustomButton from 'components/CustomButton';

import { hideModal, initBootstrapModal } from 'app/utils/Modal';
import {
  fetchCustomers, isPostLoadingSelector, newCustomerRequest,
} from 'state/customers/customersSlice';

interface NewCustomerFormProps {
  title: string;
  uuid: string;
}

export default function NewCustomerModal() {
  const dispatch = useAppDispatch();
  const isLoading = useSelector(isPostLoadingSelector);

  const modalId = useMemo(() => 'newCustomerModal', []);

  const schema = yup.object({
    title: yup.string().required(),
    uuid: yup.string().required(),
  }).required();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewCustomerFormProps>({
    resolver: yupResolver(schema),
  });

  const onSubmit = ({ title, uuid }: NewCustomerFormProps) => {
    const body = { title, uuid };
    dispatch(newCustomerRequest(body));
  };

  useEffect(() => {
    initBootstrapModal(modalId);
  }, []);

  useEffect(() => {
    hideModal(modalId);
    reset({ title: '', uuid: '' });
    dispatch(fetchCustomers());
  }, [isLoading]);

  return (
    <div className="modal fade" id={modalId} aria-labelledby={`new${modalId}Label`} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-header">
              <h5 className="modal-title" id={`new${modalId}Label`}>New Customer</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">

              <div className="mb-3">
                <label htmlFor="uuid" className="col-form-label">UUID:</label>
                <input
                  {...register('uuid')}
                  id="title"
                  className={classNames(['form-control form-control-sm', { 'is-invalid': errors.uuid }])}
                  placeholder="Enter Customer name ..."
                />
                {errors.uuid && (
                <div id="validationTitleFeedback" className="invalid-feedback">
                  <p>{errors.uuid?.message}</p>
                </div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="name" className="col-form-label">Title:</label>
                <input
                  {...register('title')}
                  id="title"
                  className={classNames(['form-control form-control-sm', { 'is-invalid': errors.title }])}
                  placeholder="Enter Customer name ..."
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
