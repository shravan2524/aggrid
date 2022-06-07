import React, { useEffect, useMemo } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'app/hooks';
import CustomButton from 'components/CustomButton';
import {
  fetchCustomers,
  isPutLoadingSelector, updateCustomerRequest,

} from 'state/customers/customersSlice';
import { hideModal } from 'app/utils/Modal';
import { CustomersType } from 'services/customersAPIService';

interface EditCustomerFormProps {
  title: string;
}

interface EditCustomerModalProps {
  customerToEdit: CustomersType | null;
}
export default function EditCustomerModal({ customerToEdit }: EditCustomerModalProps) {
  const dispatch = useAppDispatch();
  const isLoading = useSelector(isPutLoadingSelector);

  const modalId = useMemo(() => 'editCustomerModal', []);

  const schema = yup.object({
    title: yup.string().required(),
  }).required();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditCustomerFormProps>({
    resolver: yupResolver(schema),
  });

  const onSubmit = ({ title }: EditCustomerFormProps) => {
    const payload = { data: { title }, id: customerToEdit?.id };
    dispatch(updateCustomerRequest({ ...payload }));
  };

  useEffect(() => {
    dispatch(fetchCustomers()).then(() => {
      hideModal(modalId);
    });
  }, [isLoading]);

  useEffect(() => {
    reset({ title: customerToEdit?.title });
  }, [customerToEdit]);

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
                <label htmlFor="title" className="col-form-label">Title:</label>
                <input
                  {...register('title')}
                  id="title"
                  className={classNames(['form-control form-control-sm', { 'is-invalid': errors.title }])}
                  placeholder="Enter Customer title ..."
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