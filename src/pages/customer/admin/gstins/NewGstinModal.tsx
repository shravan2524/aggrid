import React, { useCallback, useEffect } from 'react';
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
    isPostLoadingSelector,
    newGstinRequest,
} from 'state/gstins/gstinsSlice';
import { hideModal, onModalHidden } from 'app/utils/Modal';
import { validGSTINRule, yupEmptyCharsRule } from 'app/utils/YupRules';

interface NewGstinFormProps {
    name: string;
    gstin: string;
    panId: number | undefined;
}

export default function NewGstinModal() {
    const dispatch = useAppDispatch();
    const isLoading = useSelector(isPostLoadingSelector);
    const selectedCustomer = useSelector(getSelectedTenant);
    const gstinSelector = useSelector(getGstins);

    const modalId = 'newGstinModal';

    const schema = yup.object({
        name: yup.string().required('Title is a required field').test(yupEmptyCharsRule),
        panId: yup.string(),
        gstin: yup.string().test(validGSTINRule),
    }).required();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<NewGstinFormProps>({
        resolver: yupResolver(schema),
    });

    const onModalClose = useCallback(() => {
        onModalHidden(modalId, () => {
            reset({ name: '', gstin: '' });
            dispatch(fetchGstins());
        });
    }, []);

    const onSubmit = ({ name, panId, gstin }: NewGstinFormProps) => {
        const body: any = {
            name,
            customer_id: Number(selectedCustomer?.id),
            panId: Number(panId),
        };
        if (gstin !== '') {
            if (gstin) {
                body.gstin = gstin;
            }
        }

        dispatch(newGstinRequest(body));
    };

    useEffect(() => {
        hideModal(modalId);
    }, [isLoading]);

    useEffect(() => {
        onModalClose();
    }, []);

    return (
      <div className="modal fade" id={modalId} aria-labelledby={`new${modalId}Label`} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="modal-header">
                <h5 className="modal-title" id={`new${modalId}Label`}>New Gstin</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="panId" className="col-form-label">Pan:</label>
                  <select
                    {...register('panId')}
                    className={classNames(['form-select form-select-sm', { 'is-invalid': errors.panId }])}
                  >
                    <option value="">Please select Pan ...</option>
                    {gstinSelector && gstinSelector.map((option) => (
                      <option key={option.id} value={option.id}>{option.name}</option>
                                    ))}
                  </select>

                  {errors.panId && (
                    <div id="validationTitleFeedback" className="invalid-feedback">
                      <p>{errors.panId?.message}</p>
                    </div>
                                )}
                </div>

                <div className="mb-3">
                  <label htmlFor="name" className="col-form-label">Title:</label>
                  <input
                    {...register('name')}
                    id="title"
                    className={classNames(['form-control form-control-sm', { 'is-invalid': errors.name }])}
                    placeholder="Enter Gstin name ..."
                  />
                  {errors.name && (
                    <div id="validationTitleFeedback" className="invalid-feedback">
                      <p>{errors.name?.message}</p>
                    </div>
                                )}
                </div>
                <div className="mb-3">
                  <label htmlFor="gstin" className="col-form-label">GSTIN:</label>
                  <input
                    {...register('gstin')}
                    id="gstin"
                    className={classNames(['form-control form-control-sm', { 'is-invalid': errors.gstin }])}
                    placeholder="Enter Gstin GSTIN ..."
                  />
                  {errors.gstin && (
                    <div id="validationGstinFeedback" className="invalid-feedback">
                      <p>{errors.gstin?.message}</p>
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
