import React, { useEffect, useState } from 'react';
import Modal from 'components/Modal';
import { useAppDispatch } from 'app/hooks';
import { useSelector } from 'react-redux';
import {
  isPutLoadingSelector, updatePanRequest,
} from 'state/pans/pansSlice';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import classNames from 'classnames';
import { PanType } from 'services/pansAPIService';

interface EditPanFormProps {
    pan: string;
    title: string;
}

interface EditPanModalProps {
    show : boolean
    onClose: () => void,
    panData: PanType | null,
}

function EditPanModal({ show, onClose, panData }: EditPanModalProps): React.ReactElement {
    const dispatch = useAppDispatch();
    const isLoading = useSelector(isPutLoadingSelector);

    const [showModal, setShowModal] = useState<boolean>(show);

    const schema = yup.object({
        pan: yup.string().required('Pan is a required field'),
        title: yup.string().required('Title is a required field'),
    }).required();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<EditPanFormProps>({
        resolver: yupResolver(schema),
    });

    const onSubmit = ({ pan, title }: EditPanFormProps) => {
        const payload: any = {
            data: {
                pan,
                title,
            },
            id: panData?.id,
        };
        dispatch(updatePanRequest({ ...payload })).then(() => setShowModal(false));
    };

    useEffect(() => {
        setShowModal(show);
    }, [show]);

    useEffect(() => {
        reset({
            title: panData?.title,
            pan: panData?.pan,
        });
    }, [panData]);

    return (
      <Modal
        title="Edit Pan"
        show={showModal}
        isScrollable={false}
        large
        onClose={onClose}
        closeButtonText="Close"
        handleSubmit={handleSubmit(onSubmit)}
        okButtonText="Update Pan"
        isLoading={isLoading}
      >
        <div className="mb-3">
          <label htmlFor="pan" className="col-form-label">PAN:</label>
          <input
            {...register('pan')}
            id="pan"
            className={classNames(['form-control form-control-sm', { 'is-invalid': errors.pan }])}
            placeholder="Enter PAN ..."
          />
          {errors.pan && (
            <div id="validationPanFeedback" className="invalid-feedback">
              <p>{errors.pan?.message}</p>
            </div>
                )}
        </div>

        <div className="mb-3">
          <label htmlFor="title" className="col-form-label">Title:</label>
          <input
            {...register('title')}
            id="title"
            className={classNames(['form-control form-control-sm', { 'is-invalid': errors.title }])}
            placeholder="Enter Title ..."
          />
          {errors.title && (
            <div id="validationTitleFeedback" className="invalid-feedback">
              <p>{errors.title?.message}</p>
            </div>
                )}
        </div>
      </Modal>
    );
}

export default React.memo(EditPanModal);
