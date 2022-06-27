import React, { useEffect, useMemo } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'app/hooks';
import CustomButton from 'components/CustomButton';
import { getSelectedTenant } from 'state/tenants/tenantsSlice';
import {
  readAll,
  readAllSelector,
  isLoadingSelector,
  isPostLoadingSelector,
  isPutLoadingSelector, update, create,

} from 'state/roles/slice';
import { hideModal } from 'app/utils/Modal';
import { RoleType } from 'services/roles';

interface ModalProps {
  itemData: RoleType | null;
}
export default function SaveFormModal({ itemData }: ModalProps) {
  const dispatch = useAppDispatch();
  const isPutLoading = useSelector(isPutLoadingSelector);
  const isPostLoading = useSelector(isPostLoadingSelector);
  const isLoading = isPostLoading || isPutLoading;

  const modalId = useMemo(() => 'saveRoleModal', []);

  const schema = yup.object({
    title: yup.string().required(),
    policies: yup.array(),
  }).required();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoleType>({
    resolver: yupResolver(schema),
  });

  const onSubmit = ({ title, policies }: RoleType) => {
    if (itemData?.id) {
      dispatch(update({ title, policies, id: itemData.id }));
    } else {
      dispatch(create({ title, policies }));
    }
  };

  useEffect(() => {
    dispatch(readAll()).then(() => {
      hideModal(modalId);
    });
  }, [isLoading]);

  const modalTitle = itemData?.id ? 'Edit Role' : 'Create Role';

  return (
    <div className="modal fade" id={modalId} aria-labelledby={`new${modalId}Label`} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-header">
              <h5 className="modal-title" id={`new${modalId}Label`}>{modalTitle}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="title" className="col-form-label">TITLE:</label>
                <input
                  {...register('title')}
                  id="title"
                  className={classNames(['form-control form-control-sm', { 'is-invalid': errors.title }])}
                  placeholder="Enter TITLE ..."
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
