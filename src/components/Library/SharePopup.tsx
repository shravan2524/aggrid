import React, { useCallback, useEffect, useState } from 'react';
import './style.scss';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import classNames from 'classnames';
import {
  shareFilterData,
  Filters,
  getUsersInFilter,
  deleteUsersInFilter,
} from 'services/filtersAPIService';
import toast from 'react-hot-toast';

interface FilterProps {
  email: string;
}
interface ModalProps {
  itemData: Filters | null;
  shared: boolean;
}

export default function ShareDataModal({ itemData, shared }: ModalProps) {
  const modalId = 'shareDataModal';
  const [isLoading, setIsLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [users, setUsers] = useState<any[]>();

  const OnClose = (reset) => {
    setIsLoading(false);
    reset();
    toast.success('Data shared succesfully');
  };

  const FetchUsers = () => {
    setUserLoading(true);
    getUsersInFilter(itemData?.id).then((data) => {
      setUserLoading(false);
      setUsers(data);
    });
  };

  const OndeleteSharedUser = (user) => {
    const data = {
      id: user.id,
      filterid: itemData?.id,
    };
    if (data.filterid || user) {
      if (window.confirm(`${user?.contact.email} Will be deleted`)) {
        deleteUsersInFilter(data).then(() => {
          FetchUsers();
          toast.success('User Deleted succesfully');
        });
      }
    }
  };

  const schema = yup
    .object({
      email: yup.string().email().required('Email is a required field'),
    })
    .required();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FilterProps>({
    resolver: yupResolver(schema),
  });

  const onSubmit = ({ email }: FilterProps) => {
    if (itemData?.id) {
      setIsLoading(true);
      shareFilterData({ id: itemData?.id, data: { email } })
        .then((data) => {
          OnClose(reset);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    if (itemData?.id) {
      FetchUsers();
    }
  }, [isLoading, itemData]);

  return (
    <div
      className="modal fade"
      id={modalId}
      aria-labelledby={`new${modalId}Label`}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={`new${modalId}Label`}>
              Share Data
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              <div className="mb-4 w-100">
                <input
                  type="email"
                  {...register('email')}
                  className={classNames([
                    'w-100 inputed rounded-top',
                    { 'is-invalid': errors.email },
                  ])}
                  placeholder="Add user email"
                />
                {errors.email && (
                  <div className="invalid-feedback">
                    <p>{errors.email?.message}</p>
                  </div>
                )}
              </div>
              {/* acess people */}
              {userLoading && (
                <div className="text-warning w-100 text-center">
                  <span className="spinner-border text-center spinner-border-sm" />
                </div>
              )}
              {users && users.length > 0 && !userLoading && (
                <>
                  <h5>People with access</h5>
                  {users.map((u, i) => (
                    <div
                      key={u.userId}
                      className="p-2 mb-1 hover-user rounded-pill d-flex justify-content-between align-items-center gap-2"
                    >
                      <div className="w-75 d-flex gap-2 align-items-center">
                        <div className="user d-flex justify-content-center align-items-center rounded-circle">
                          <i className="fas fa-user-circle" />
                        </div>
                        <p>{u.contact.email}</p>
                      </div>
                      <div className="w-25 px-2 d-flex justify-content-end align-items-center">
                        <button
                          onClick={() => OndeleteSharedUser(u)}
                          type="button"
                          className="btn btn-light"
                        >
                          <i className="fas fa-trash-alt text-danger" />
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="submit"
                className="btn btn-md btn-primary d-flex gap-3 justify-content-center align-items-center"
              >
                Share
                {isLoading ? (
                  <i className="spinner-border spinner-border-sm" />
                ) : (
                  <i className="fas fa-paper-plane" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
