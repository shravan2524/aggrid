import React,
{ useEffect, useState }
from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import classNames from 'classnames';
import CustomButton from 'components/CustomButton';
import { hideModal } from 'app/utils/Modal';
import {
  createFoldersData,
  fetchFoldersData,
  Folders,
  putFoldersData,
} from 'services/FolderAPIService';

interface ModalProps {
  itemData: Folders | null;
  setFolders: React.Dispatch<React.SetStateAction<Folders[] | undefined>>;
  setItemData: React.Dispatch<React.SetStateAction<Folders | null>>;
}

interface SaveFormTypes {
  title: string;
}

function SaveFolderModal({ itemData, setFolders, setItemData }: ModalProps) {
  const modalId = 'saveFolderModal';
  const [isLoading, setIsLoading] = useState(false);

  const cleanUp = (reset) => {
    setIsLoading(false);
    setItemData(null);
    hideModal(modalId, () => {
      reset();
      fetchFoldersData().then((data) => {
        setFolders(data);
      });
    });
  };

  const schema = yup
    .object({
      title: yup.string().required(),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<SaveFormTypes>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (formData) => {
    if (!formData) {
      return;
    }
    const data: SaveFormTypes = {
      title: formData.title,
    };

    if (itemData?.id) {
      setIsLoading(true);
      putFoldersData({ id: itemData.id, ...data }).then(() => {
        cleanUp(reset);
      });
    } else {
      setIsLoading(true);
      createFoldersData(formData).then(() => {
        cleanUp(reset);
      });
    }
  };

  useEffect(() => {
    if (itemData) {
      setValue('title', itemData.title);
    }
  }, [itemData]);

  const modalTitle = itemData?.id ? 'Edit Folder' : 'Create Folder';

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
                {modalTitle}
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
                Save
              </CustomButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SaveFolderModal;
