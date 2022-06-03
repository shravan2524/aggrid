import React, { useEffect, useMemo } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'app/hooks';
import CustomButton from 'components/CustomButton';
import { getSelectedCustomer } from 'state/customers/customersSlice';
import {
  fetchCompanies,
  getCompanies,
  isPutLoadingSelector, updateCompanyRequest,

} from 'state/companies/companiesSlice';
import { hideModal } from 'app/utils/Modal';
import { CompaniesType } from 'services/companiesAPIService';

interface EditCompanyFormProps {
  name: string;
  customer_id: number | undefined;
  parent: number | undefined;
}

interface EditCompanyModalProps {
  companyToEdit: CompaniesType | null;
}
export default function EditCompanyModal({ companyToEdit }: EditCompanyModalProps) {
  const dispatch = useAppDispatch();
  const isLoading = useSelector(isPutLoadingSelector);
  const selectedCustomer = useSelector(getSelectedCustomer);
  const companySelector = useSelector(getCompanies);

  const modalId = useMemo(() => 'editCompanyModal', []);

  const schema = yup.object({
    name: yup.string().required(),
    customer_id: yup.string().required(),
    parent: yup.string(),
  }).required();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditCompanyFormProps>({
    resolver: yupResolver(schema),
  });

  const onSubmit = ({ name, customer_id, parent }: EditCompanyFormProps) => {
    const payload = { data: { name, parent: Number(parent), customer_id }, id: companyToEdit?.id };
    dispatch(updateCompanyRequest({ ...payload }));
  };

  useEffect(() => {
    reset({ customer_id: selectedCustomer?.id });
  }, [selectedCustomer]);

  useEffect(() => {
    dispatch(fetchCompanies()).then(() => {
      hideModal(modalId);
    });
  }, [isLoading]);

  useEffect(() => {
    const parentCom = companySelector.find((i) => i.parent === companyToEdit?.parent);
    reset({ name: companyToEdit?.name, parent: parentCom?.parent });
  }, [companyToEdit]);

  return (
    <div className="modal fade" id={modalId} aria-labelledby={`new${modalId}Label`} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-header">
              <h5 className="modal-title" id={`new${modalId}Label`}>New Company</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">

              <div className="mb-3">
                <label htmlFor="customer" className="col-form-label">
                  Customer:
                  {selectedCustomer?.title}
                </label>
                <input type="hidden" {...register('customer_id')} />

                {errors.customer_id && (
                <div id="validationTitleFeedback" className="invalid-feedback">
                  <p>{errors.customer_id?.message}</p>
                </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="customer" className="col-form-label">Parent:</label>
                <select
                  {...register('parent')}
                  className={classNames(['form-select form-select-sm', { 'is-invalid': errors.parent }])}
                >
                  <option value="">Please select Parent Company ...</option>
                  {companySelector && companySelector.map((option) => (
                    <option key={option.id} value={option.id}>{option.name}</option>
                  ))}
                </select>

                {errors.parent && (
                <div id="validationTitleFeedback" className="invalid-feedback">
                  <p>{errors.parent?.message}</p>
                </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="name" className="col-form-label">Title:</label>
                <input
                  {...register('name')}
                  id="title"
                  className={classNames(['form-control form-control-sm', { 'is-invalid': errors.name }])}
                  placeholder="Enter Company name ..."
                />
                {errors.name && (
                <div id="validationTitleFeedback" className="invalid-feedback">
                  <p>{errors.name?.message}</p>
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
