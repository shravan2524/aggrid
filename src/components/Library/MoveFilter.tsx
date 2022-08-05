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
import {
  fetchFoldersData,
  Folders,
  postFilterInFolderData,
} from 'services/FolderAPIService';

interface Filter {
  folder: string;
}

interface Filter2 {
  id: number | undefined;
  filterId: number | undefined;
}

interface Props3 {
  params: Filters | null;
}

export default function MoveFilterPopup({ params }: Props3) {
  const modalId = 'moveFilterPopup';
  const [isLoading, setIsLoading] = useState(false);
  const [folders, setFolders] = useState<Folders[] | []>([]);

  const schema = yup
    .object({
      folder: yup.string().required('Select folder'),
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
    const data: Filter2 = {
      id: Number(formData.folder),
      filterId: Number(params?.id),
    };

    if (params?.id) {
      setIsLoading(true);
      postFilterInFolderData(data)
        .then(() => {
          setIsLoading(false);
          toast.success('File Moved');
          hideModal(modalId, () => {
            reset();
          });
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchFoldersData().then((data) => {
      setFolders(data);
    });
  }, [params]);

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
              <h5 className="modal-folder" id={`new${modalId}Label`}>
                Move File
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
                <label htmlFor="folder" className="col-form-label required">
                  Folder (*)
                </label>
                <select
                  {...register('folder')}
                  id="folder"
                  className={classNames([
                    'form-select form-select-sm',
                    { 'is-invalid': errors.folder },
                  ])}
                >
                  <option value="">Select Folder</option>
                  {folders
                  && folders.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.title}
                    </option>
                    ))}
                </select>
                {errors.folder && (
                  <div
                    id="validationTitleFeedback"
                    className="invalid-feedback"
                  >
                    <p>{errors.folder?.message}</p>
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
                Move
              </CustomButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
