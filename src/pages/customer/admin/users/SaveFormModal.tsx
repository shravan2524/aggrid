import React, { useEffect, useMemo, useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'app/hooks';
import CustomButton from 'components/CustomButton';
import {
  readAll,
  isPostLoadingSelector,
  isPutLoadingSelector, update, create,

} from 'state/users/slice';
import { hideModal } from 'app/utils/Modal';
import { ItemType } from 'services/users';
import { readAllSelector as rolesReadAllSelector, readAll as rolesReadAll } from 'state/roles/slice';

interface ModalProps {
  itemData: ItemType | null;
  modalIdentifier: string;
}

interface SaveFormTypes {
  email: string;
  roles: any[];
}

export default function SaveFormModal({ itemData, modalIdentifier }: ModalProps) {
  const dispatch = useAppDispatch();
  const [selectedRoles, setSelectedRoles] = useState<any>([]);
  const isPutLoading = useSelector(isPutLoadingSelector);
  const isPostLoading = useSelector(isPostLoadingSelector);
  const isLoading = isPostLoading || isPutLoading;
  const allRoles = useSelector(rolesReadAllSelector);

  const modalId = useMemo(() => modalIdentifier, []);

  const schema = yup.object({
    email: yup.string().required().email(),
    roles: yup.array(),
  }).required();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SaveFormTypes>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (formData) => {
    if (!formData) {
      return;
    }

    const data: SaveFormTypes = {
      email: formData.email,
      roles: formData.roles,
    };

    if (itemData?.id) {
      dispatch(update({ email: data.email, id: itemData.id, roles: data.roles }));
    } else {
      dispatch(create({ email: data.email, roles: data.roles }));
    }
  };

  useEffect(() => {
    dispatch(readAll()).then(() => {
      hideModal(modalId);
    });
  }, [isLoading]);

  useEffect(() => {
    if (itemData) {
      setValue('email', itemData.email);
    }

    return function cleanup() {
      setValue('email', '');
    };
  }, [itemData]);

  useEffect(() => {
    dispatch(rolesReadAll());
  }, []);
  useEffect(() => {
    const selRoles = itemData?.roles?.map((itm) => String(itm));
    setSelectedRoles(selRoles);
  }, [itemData]);

  const setSelectedRolesOnChange = (e) => {
    const { options } = e.target;
    const value: any = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }

    setSelectedRoles(value);
  };

  const modalTitle = itemData?.id ? 'Edit User' : 'Invite User';

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
                <label htmlFor="e-mail" className="col-form-label required">E-mail (*)</label>
                <input
                  {...register('email')}
                  id="email"
                  className={classNames(['form-control form-control-sm', { 'is-invalid': errors.email }])}
                  type="email"
                />
                {errors.email && (
                  <div id="validationTitleFeedback" className="invalid-feedback">
                    <p>{errors.email?.message}</p>
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="parent" className="col-form-label">Roles:</label>
                <select
                  {...register('roles')}
                  className={classNames(['form-select form-select-sm', { 'is-invalid': errors.roles }])}
                  multiple
                  onChange={setSelectedRolesOnChange}
                  value={selectedRoles}
                >
                  {allRoles && allRoles.map((option) => (
                    <option key={option.id} value={option.id}>{option.title}</option>
                  ))}
                </select>
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
