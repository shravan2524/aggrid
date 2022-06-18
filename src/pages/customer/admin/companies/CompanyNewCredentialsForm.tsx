import React from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import CustomButton from 'components/CustomButton';
import { getSelectedCustomer } from 'state/customers/customersSlice';
import { CompaniesType } from 'services/companiesAPIService';

interface CompanyNewFormProps {
  username: string;
  password: string;
}

interface CompanyNewCredentialsFormProps {
  companyData: CompaniesType | null;
  modalId: string;
  isLoading: boolean;
}
export default function CompanyNewCredentialsForm({ modalId, companyData, isLoading }: CompanyNewCredentialsFormProps) {
  const selectedCustomer = useSelector(getSelectedCustomer);

  const schema = yup.object({
    username: yup.string().required(),
    password: yup.string().required(),
  }).required();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyNewFormProps>({
    resolver: yupResolver(schema),
  });

  const onSubmit = ({ username, password }: CompanyNewFormProps) => {
    const payload = { data: { username, password }, id: companyData?.id };
    // dispatch(updateCompanyRequest({ ...payload }));
    console.log('New Company Credentials: ', payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="modal-header">
        <h5 className="modal-title" id={`new${modalId}Label`}>New Company Credentials</h5>
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
            {companyData?.name}
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
          New Company Credentials
        </CustomButton>
      </div>
    </form>
  );
}
