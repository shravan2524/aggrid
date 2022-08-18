import React, {
 useCallback, useEffect, useRef, useState,
} from 'react';
import Modal from 'components/Modal';
import { useAppDispatch } from 'app/hooks';
import { useSelector } from 'react-redux';
import { isPostLoadingSelector, newPanRequest } from 'state/pans/pansSlice';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import classNames from 'classnames';

interface NewPanFormProps {
    pan: string;
    title: string;
}

interface NewPanModalProps {
    show : boolean
    onClose: () => void,
}

function NewPanModal({ show, onClose }: NewPanModalProps): React.ReactElement {
    const dispatch = useAppDispatch();
    const isLoading = useSelector(isPostLoadingSelector);

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
    } = useForm<NewPanFormProps>({
        resolver: yupResolver(schema),
    });

    const onSubmit = ({ pan, title }: NewPanFormProps) => {
        const body: any = {
            pan,
            title,
        };
        dispatch(newPanRequest(body)).then(() => setShowModal(false));
    };

    useEffect(() => {
        reset({ pan: '', title: '' });
        setShowModal(show);
    }, [show]);

    return (
      <Modal
        title="New Pan"
        show={showModal}
        isScrollable={false}
        large
        onClose={onClose}
        closeButtonText="Close"
        handleSubmit={handleSubmit(onSubmit)}
        okButtonText="Add Pan"
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
            id="pan"
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

export default React.memo(NewPanModal);
