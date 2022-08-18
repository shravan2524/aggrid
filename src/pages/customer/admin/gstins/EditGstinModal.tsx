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
  fetchGstins,
  getGstins,
  isPutLoadingSelector,
  updateGstinRequest,
} from 'state/gstins/gstinsSlice';
import { hideModal, onModalHidden } from 'app/utils/Modal';
import { GstinsType } from 'services/gstinsAPIService';
import { validGSTINRule, yupEmptyCharsRule } from 'app/utils/YupRules';

interface EditGstinFormProps {
  name: string;
  panId: number | undefined;
  gstin: string | undefined;
}

interface EditGstinModalProps {
  gstinData: GstinsType | null;
}
export default function EditGstinModal({
  gstinData,
}: EditGstinModalProps) {
  const dispatch = useAppDispatch();
  const isLoading = useSelector(isPutLoadingSelector);
  const selectedCustomer = useSelector(getSelectedTenant);
  const gstinSelector = useSelector(getGstins);

  const modalId = useMemo(() => 'editgstinModal', []);

  const schema = yup
    .object({
      name: yup.string().required('Title is a required field').test(yupEmptyCharsRule),
      panId: yup.string(),
      gstin: yup.string().test(validGSTINRule),
    })
    .required();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditGstinFormProps>({
    resolver: yupResolver(schema),
  });

  const onModalClose = useCallback(() => {
    onModalHidden(modalId, () => {
      dispatch(fetchGstins());
    });
  }, []);

  const onSubmit = ({ name, panId, gstin }: EditGstinFormProps) => {
    const payload: any = {
      data: {
        name,
        panId: Number(panId),
        customer_id: Number(selectedCustomer?.id),
      },
      id: gstinData?.id,
    };

    if (gstin !== '') {
      if (gstin) {
        payload.data.gstin = gstin;
      }
    }
    dispatch(updateGstinRequest({ ...payload }));
  };

  useEffect(() => {
    hideModal(modalId);
  }, [isLoading]);

  useEffect(() => {
    const parentCom = gstinSelector.find(
      (i) => i.panId === gstinData?.panId,
    );
    reset({
      name: gstinData?.name,
      panId: parentCom?.panId,
      gstin: gstinData?.gstin,
    });
  }, [gstinData]);

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
                Edit Gstin
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
                  Pan:
                </label>
                <select
                  {...register('panId')}
                  className={classNames([
                    'form-select form-select-sm',
                    { 'is-invalid': errors.panId },
                  ])}
                >
                  <option value="">Please select Pan ...</option>
                  {gstinSelector
                  && gstinSelector.map((option) => (
                    (gstinData && option.name !== gstinData.name)
                    ? <option key={option.id} value={option.id}>{option.name}</option>
                    : null
                 ))}
                </select>

                {errors.panId && (
                  <div
                    id="validationTitleFeedback"
                    className="invalid-feedback"
                  >
                    <p>{errors.panId?.message}</p>
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
                  placeholder="Enter Gstin name ..."
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
