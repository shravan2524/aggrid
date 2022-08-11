import React, { useEffect, useState } from 'react';
import './style.scss';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { yupEmptyCharsRule } from 'app/utils/YupRules';
import classNames from 'classnames';
import CustomButton from 'components/CustomButton';
import { createFilterData, shareFilterData } from 'services/filtersAPIService';
import toast from 'react-hot-toast';

interface Filter {
  title: string;
}
interface SharedUser {
  email: string;
}

interface Props1 {
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setFilter: React.Dispatch<React.SetStateAction<boolean>>;
  setFilterId: React.Dispatch<React.SetStateAction<number | undefined>>;
  filterSetting: any;
}

interface Props2 {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  filterId: number | undefined;
  handleClose: () => void;
}
interface Props3 {
  filterSetting: any;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

function FilterTitle({
  isLoading,
  setUser,
  setIsLoading,
  setFilter,
  setFilterId,
  filterSetting,
}: Props1) {
  const schema = yup
    .object({
      title: yup
        .string()
        .required('Title is a required field')
        .test(yupEmptyCharsRule),
    })
    .required();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Filter>({
    resolver: yupResolver(schema),
  });

const onSubmit = ({ title }: Filter) => {
    const datas = {
      settings: filterSetting.settings,
      title,
      modelName: filterSetting.modelName === '2A' ? 'GSTR2AFileContent' : filterSetting.modelName === '2B' ? 'GSTR2BFileContent' : `${filterSetting.modelName}FileContent`,
      modelId: filterSetting.modelId,
    };

    setIsLoading(true);
    createFilterData(datas)
      .then((data: any) => {
        setIsLoading(false);
        setFilterId(data.id);
        setUser(true);
        setFilter(false);
        reset();
      })
      .catch(() => {
        setIsLoading(false);
      });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="modal-body">
        <div className="mb-4 w-100">
          <input
            type="text"
            {...register('title')}
            className={classNames([
              'w-100 inputed rounded-top',
              { 'is-invalid': errors.title },
            ])}
            placeholder="Data title"
          />
          {errors.title && (
            <div className="invalid-feedback">
              <p>{errors.title?.message}</p>
            </div>
          )}
        </div>
      </div>
      <div className="modal-footer">
        <CustomButton
          isLoading={isLoading}
          isSubmit
          className="btn btn-md btn-primary"
        >
          Next
        </CustomButton>
      </div>
    </form>
  );
}

function ShareUser({
  setIsLoading,
  isLoading,
  filterId,
  handleClose,
}: Props2) {
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
  } = useForm<SharedUser>({
    resolver: yupResolver(schema),
  });

  const onSubmit = ({ email }: SharedUser) => {
    setIsLoading(true);
    shareFilterData({ id: filterId, data: { email } })
      .then((data) => {
        setIsLoading(false);
        handleClose();
        reset();
        toast.success('Data shared succesfully');
      })
      .catch(() => {
        setIsLoading(false);
      });
  };
  return (
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
  );
}

export default function NewSharePopup({ setShow, filterSetting }: Props3) {
  const modalId = 'newSharePopup';
  const [filter, setFilter] = useState(true);
  const [user, setUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filterId, setFilterId] = useState<number>();
  const handleClose = () => {
    setShow(false);
    setFilter(true);
    setUser(false);
    setFilterId(0);
  };

  useEffect(() => {}, [filter, user, filterSetting, isLoading]);

  return (
    <div className="modal-content rounded-md">
      <div className="modal-header">
        <h5 className="modal-title" id={`new${modalId}Label`}>
          Share Data
        </h5>
        <button type="button" className="btn-close" onClick={handleClose} />
      </div>
      {filter && (
        <FilterTitle
          isLoading={isLoading}
          setFilter={setFilter}
          setIsLoading={setIsLoading}
          setUser={setUser}
          filterSetting={filterSetting}
          setFilterId={setFilterId}
        />
      )}
      {user && (
        <ShareUser
          filterId={filterId}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          handleClose={handleClose}
        />
      )}
    </div>
  );
}
