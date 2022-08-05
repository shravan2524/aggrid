import React, { useEffect, useState } from 'react';
import './style.scss';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { yupEmptyCharsRule } from 'app/utils/YupRules';
import classNames from 'classnames';
import CustomButton from 'components/CustomButton';
import { Filters, updateFilter } from 'services/filtersAPIService';
import { hideModal } from 'app/utils/Modal';
import toast from 'react-hot-toast';

interface Filter {
  title: string;
}

interface Props3 {
  editFilter: Filters | null;
  onfetchData: () => void;
}

export default function EditFilterPopup({ editFilter, onfetchData }: Props3) {
  const modalId = 'editFilterPopup';
  const [isLoading, setIsLoading] = useState(false);

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
    setValue,
    formState: { errors },
  } = useForm<Filter>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (formData) => {
    if (!formData) {
      return;
    }
    const data: Filter = {
      title: formData.title,
    };

    if (editFilter?.id) {
      setIsLoading(true);
      updateFilter({ id: editFilter?.id, ...data })
        .then(() => {
          setIsLoading(false);
          toast.success('File Updated');
          hideModal(modalId, () => {
            reset();
            onfetchData();
          });
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    if (editFilter?.id) {
      setValue('title', editFilter.title);
    }
  }, [editFilter]);

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
                Edit Data
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
                <label htmlFor="title" className="col-form-label required">
                  Title (*)
                </label>
                <input
                  {...register('title')}
                  id="title"
                  className={classNames([
                    'form-control form-control-sm',
                    { 'is-invalid': errors.title },
                  ])}
                  placeholder=""
                />
                {errors.title && (
                  <div
                    id="validationTitleFeedback"
                    className="invalid-feedback"
                  >
                    <p>{errors.title?.message}</p>
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
