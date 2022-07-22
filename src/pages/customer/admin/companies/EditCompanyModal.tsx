import React, { useCallback, useEffect, useMemo } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'app/hooks';
import CustomButton from 'components/CustomButton';
import { getSelectedTenant } from 'state/tenants/tenantsSlice';
import {
  fetchCompanies,
  getCompanies,
  isPutLoadingSelector,
  updateCompanyRequest,
} from 'state/companies/companiesSlice';
import { hideModal, onModalHidden } from 'app/utils/Modal';
import { CompaniesType } from 'services/companiesAPIService';
import { validGSTINRule, yupEmptyCharsRule } from 'app/utils/YupRules';

interface EditCompanyFormProps {
  name: string;
  parent: number | undefined;
  gstin: string | undefined;
}

interface EditCompanyModalProps {
  companyData: CompaniesType | null;
}
export default function EditCompanyModal({
  companyData,
}: EditCompanyModalProps) {
  const dispatch = useAppDispatch();
  const isLoading = useSelector(isPutLoadingSelector);
  const selectedCustomer = useSelector(getSelectedTenant);
  const companySelector = useSelector(getCompanies);

  const modalId = useMemo(() => 'editCompanyModal', []);

  const schema = yup
    .object({
      name: yup.string().required().test(yupEmptyCharsRule),
      parent: yup.string(),
      gstin: yup.string().test(validGSTINRule),
    })
    .required();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditCompanyFormProps>({
    resolver: yupResolver(schema),
  });

  const onModalClose = useCallback(() => {
    onModalHidden(modalId, () => {
      dispatch(fetchCompanies());
    });
  }, []);

  const onSubmit = ({ name, parent, gstin }: EditCompanyFormProps) => {
    const payload: any = {
      data: {
        name,
        parent: Number(parent),
        customer_id: Number(selectedCustomer?.id),
      },
      id: companyData?.id,
    };

    if (gstin !== '') {
      if (gstin) {
        payload.data.gstin = gstin;
      }
    }
    dispatch(updateCompanyRequest({ ...payload }));
  };

  useEffect(() => {
    hideModal(modalId);
  }, [isLoading]);

  useEffect(() => {
    const parentCom = companySelector.find(
      (i) => i.parent === companyData?.parent,
    );
    reset({
      name: companyData?.name,
      parent: parentCom?.parent,
      gstin: companyData?.gstin,
    });
  }, [companyData]);

  useEffect(() => {
    onModalClose();
  }, []);

  return (
    <div
      className="modal fade"
      id={modalId}
      aria-labelledby={`new${modalId}Label`}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-header">
              <h5 className="modal-title" id={`new${modalId}Label`}>
                Edit Company
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="customer" className="col-form-label">
                  Parent:
                </label>
                <select
                  {...register('parent')}
                  className={classNames([
                    'form-select form-select-sm',
                    { 'is-invalid': errors.parent },
                  ])}
                >
                  <option value="">Please select Parent Company ...</option>
                  {companySelector
                  && companySelector.map((option) => (
                    <option key={option.id} value={option.id}>{option.name}</option>
                 ))}
                </select>

                {errors.parent && (
                  <div
                    id="validationTitleFeedback"
                    className="invalid-feedback"
                  >
                    <p>{errors.parent?.message}</p>
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="name" className="col-form-label">
                  Title:
                </label>
                <input
                  {...register('name')}
                  id="title"
                  className={classNames([
                    'form-control form-control-sm',
                    { 'is-invalid': errors.name },
                  ])}
                  placeholder="Enter Company name ..."
                />
                {errors.name && (
                  <div
                    id="validationTitleFeedback"
                    className="invalid-feedback"
                  >
                    <p>{errors.name?.message}</p>
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="gstin" className="col-form-label">
                  GSTIN:
                </label>
                <input
                  {...register('gstin')}
                  id="gstin"
                  className={classNames([
                    'form-control form-control-sm',
                    { 'is-invalid': errors.gstin },
                  ])}
                  placeholder="Enter GSTIN ..."
                />
                {errors.gstin && (
                  <div
                    id="validationTitleFeedback"
                    className="invalid-feedback"
                  >
                    <p>{errors.gstin?.message}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-sm btn-danger"
                data-bs-dismiss="modal"
              >
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
