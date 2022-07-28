import React, { useEffect, useMemo, useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'app/hooks';
import CustomButton from 'components/CustomButton';
import {
  isPostLoadingSelector,
  isPutLoadingSelector,
  update,
  create,
} from 'state/users/slice';
import { ItemType } from 'services/users';
import { readAllSelector as rolesReadAllSelector } from 'state/roles/slice';
import { hideModal } from 'app/utils/Modal';

interface ModalProps {
  itemData: ItemType | null;
  modalIdentifier: string;
}

interface SaveFormTypes {
  email: string;
  firstName: string;
  lastName: string;
  roles: any[];
}

function SaveFormModal({ itemData, modalIdentifier }: ModalProps) {
  const dispatch = useAppDispatch();
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [rolesError, setRolesError] = useState<boolean>(false);
  const isPutLoading = useSelector(isPutLoadingSelector);
  const isPostLoading = useSelector(isPostLoadingSelector);
  const isLoading = isPostLoading || isPutLoading;
  const allRoles = useSelector(rolesReadAllSelector);

  const modalId = useMemo(() => modalIdentifier, []);

  const schema = yup
    .object({
      email: yup.string().required().email(),
      firstName: yup.string().required(),
      lastName: yup.string().required(),
      roles: yup.array(),
    })
    .required();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<SaveFormTypes>({
    resolver: yupResolver(schema),
  });

  // async function handleReset() {
  //   await Array.from(document.querySelectorAll('input')).forEach((input) => {
  //     input.value = '';
  //   });
  // }

  // function cleanup() {
  //   setValue('email', '');
  //   setValue('firstName', '');
  //   setValue('lastName', '');
  //   setValue('roles', []);
  // }

  const onSubmit = (formData) => {
    if (!formData) {
      return;
    }
    const data: SaveFormTypes = {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      roles: formData.roles,
    };
    if (selectedRoles.length === 0) {
      setRolesError(true);
    } else if (itemData?.id) {
        dispatch(update({ id: itemData.id, ...data })).then(() => {
          hideModal(modalId);
          reset();
        });
      } else {
        dispatch(create(data)).then(() => {
          hideModal(modalId);
          reset();
        });
      }
    };

  useEffect(() => {
    if (selectedRoles.length > 0) {
      setRolesError(false);
    }
  }, [isLoading, selectedRoles, modalId]);

  useEffect(() => {
    if (itemData) {
      setValue('email', itemData.email);
      setValue('firstName', itemData.firstName);
      setValue('lastName', itemData.lastName);
    }

    return reset;
  }, [itemData]);

  useEffect(() => {
    const selRoles: string[] = itemData?.roles?.map((itm) => String(itm)) || [];
    setSelectedRoles(selRoles);
  }, [itemData]);

  const setSelectedRolesOnChange = (e) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option: any) => option.value,
    );
    setSelectedRoles(value);
  };

  const modalTitle = itemData?.id ? 'Edit User' : 'Invite User';

  return (
    <div
      className="modal fade"
      id={modalId}
      aria-labelledby={`new${modalId}Label`}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form id="create-course-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-header">
              <h5 className="modal-title" id={`new${modalId}Label`}>
                {modalTitle}
              </h5>
              <button
                onClick={() => reset()}
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="e-mail" className="col-form-label required">
                  E-mail (*)
                </label>
                <input
                  {...register('email')}
                  id="email"
                  className={classNames([
                    'form-control form-control-sm',
                    { 'is-invalid': errors.email },
                  ])}
                  type="email"
                />
                {errors.email && (
                  <div
                    id="validationTitleFeedback"
                    className="invalid-feedback"
                  >
                    <p>{errors.email?.message}</p>
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="firstName" className="col-form-label required">
                  First Name (*)
                </label>
                <input
                  {...register('firstName')}
                  id="email"
                  className={classNames([
                    'form-control form-control-sm',
                    { 'is-invalid': errors.firstName },
                  ])}
                  type="text"
                />
                {errors.firstName && (
                  <div
                    id="validationfirstNameFeedback"
                    className="invalid-feedback"
                  >
                    <p>{errors.firstName?.message}</p>
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="lastName" className="col-form-label required">
                  Last Name (*)
                </label>
                <input
                  {...register('lastName')}
                  id="email"
                  className={classNames([
                    'form-control form-control-sm',
                    { 'is-invalid': errors.lastName },
                  ])}
                  type="text"
                />
                {errors.lastName && (
                  <div
                    id="validationLastNameFeedback"
                    className="invalid-feedback"
                  >
                    <p>{errors.lastName?.message}</p>
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="parent" className="col-form-label">
                  Roles:
                </label>
                <select
                  {...register('roles')}
                  className={classNames([
                    'form-select form-select-sm',
                    { 'is-invalid': errors.roles },
                  ])}
                  multiple
                  onChange={setSelectedRolesOnChange}
                  value={selectedRoles}
                >
                  {allRoles && allRoles.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.title}
                    </option>
                  ))}
                </select>
                {rolesError && (
                  <div className="text-danger text-sm mt-2">
                    <p>Select at least 1 role to this user</p>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={() => reset()}
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
                Save
              </CustomButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default React.memo(SaveFormModal);
