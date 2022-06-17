import React, { useCallback, useEffect, useMemo } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'app/hooks';
import CustomButton from 'components/CustomButton';
import { getSelectedCustomer } from 'state/customers/customersSlice';
import { CompaniesType } from 'services/companiesAPIService';
import { fetchCompanyCredentialsData } from 'services/credentialsAPIService';

interface EditCompanyFormProps {
  username: string;
  password: string;
}

interface EditCompanyCredentialsModalProps {
  companyToEditCredentials: CompaniesType | null;
}
export default function EditCompanyCredentialsModal({ companyToEditCredentials }: EditCompanyCredentialsModalProps) {
  const dispatch = useAppDispatch();
  const isLoading = false;
  const selectedCustomer = useSelector(getSelectedCustomer);

  const modalId = useMemo(() => 'editCredentialsCompanyModal', []);

  const onModalClose = useCallback(() => {

  }, []);

  const schema = yup.object({
    username: yup.string().required(),
    password: yup.string().required(),
  }).required();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditCompanyFormProps>({
    resolver: yupResolver(schema),
  });

  const onSubmit = ({ username, password }: EditCompanyFormProps) => {
    const payload = { data: { username, password }, id: companyToEditCredentials?.id };
    // dispatch(updateCompanyRequest({ ...payload }));
  };

  useEffect(() => {
    if (companyToEditCredentials) {
      fetchCompanyCredentialsData(companyToEditCredentials?.id).then((res) => {
        console.log(res);
      });
    }
  }, [companyToEditCredentials]);

  return (
    <div className="modal fade" id={modalId} aria-labelledby={`new${modalId}Label`} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-header">
              <h5 className="modal-title" id={`new${modalId}Label`}>Edit Company Credentials</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">

              <div className="mb-3">
                <label htmlFor="customer" className="col-form-label">
                  Customer:
                  {selectedCustomer?.title}
                </label>
              </div>
              <div className="mb-3">
                <label htmlFor="customer" className="col-form-label">
                  Company:
                  {companyToEditCredentials?.name}
                </label>
              </div>
              <div className="mb-3">
                <label htmlFor="username" className="col-form-label">Username:</label>
                <input
                  {...register('username')}
                  id="username"
                  className={classNames(['form-control form-control-sm', { 'is-invalid': errors.username }])}
                  placeholder="Enter Credentials username ..."
                />
                {errors.username && (
                <div id="validationTitleFeedback" className="invalid-feedback">
                  <p>{errors.username?.message}</p>
                </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="col-form-label">Password:</label>
                <input
                  {...register('password')}
                  id="password"
                  type="password"
                  className={classNames(['form-control form-control-sm', { 'is-invalid': errors.password }])}
                  placeholder="Enter Credentials password ..."
                />
                {errors.password && (
                <div id="validationTitleFeedback" className="invalid-feedback">
                  <p>{errors.password?.message}</p>
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
