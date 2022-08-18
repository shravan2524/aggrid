import React, {
    FormEventHandler,
    useEffect, useMemo, useRef,
} from 'react';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle';
import classNames from 'classnames';
import CustomButton from './CustomButton';

interface ModalProps {
    children?: React.ReactNode | number | string | boolean,
    extraHeader?: React.ReactNode | number | string | boolean,
    extraFooter?: React.ReactNode | number | string | boolean,
    title: string,
    show?: boolean,
    isScrollable?: boolean,
    isLoading?: boolean,
    onClose?: () => void,
    large?: boolean,
    handleSubmit?: FormEventHandler | undefined,
    onShow?: () => void,
    closeButtonText?: string,
    onOkButtonClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void,
    okButtonText?: string
}

const modal:Record<string, bootstrap.Modal> = {};

function Modal({
                   children,
                   title,
                   onOkButtonClick,
                   show,
                   isScrollable,
                   onClose,
                   handleSubmit,
                   large,
                   onShow,
                   isLoading,
                   closeButtonText,
                   okButtonText,
                   extraHeader,
                   extraFooter,
               }: ModalProps) {
    const modalRef = useRef<bootstrap.Modal>();
    const modalId = useMemo(() => `modal${title.replace(/\s/g, '')}`, [title]);

    useEffect(() => {
        modal[modalId] = new bootstrap.Modal(modalRef.current);

        modalRef.current?.addEventListener('hidden.bs.modal', () => {
            show = false;
            if (onClose) {
                onClose();
            }
        });

        modalRef.current?.addEventListener('shown.bs.modal', () => {
            if (onShow) {
                onShow();
            }
        });

        return () => {
            modal[modalId] = null;

            delete modal[modalId];
        };
    }, []);

    useEffect(() => {
        if (modal[modalId]) {
            if (show) {
                modal[modalId].show(modalRef.current);
            } else {
                modal[modalId].hide();
            }
        }
    }, [show]);

    return (
      <div
        ref={modalRef}
        className="modal fade"
        id={modalId}
        aria-labelledby={`${modalId}Label`}
        aria-hidden="true"
      >
        <div className={classNames(['modal-dialog', 'modal-dialog-centered', { 'modal-dialog-scrollable': isScrollable }, { 'modal-xl': large }])}>
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title" id={`${modalId}Label`}>{title}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
              </div>
              {extraHeader && (<div className="modal-header">{extraHeader}</div>)}
              <div className="modal-body">
                {children}
              </div>
              {extraFooter && (<div className="modal-footer">{extraFooter}</div>)}
              <div className="modal-footer">
                {closeButtonText && (<button type="button" className="btn btn-sm btn-secondary" data-bs-dismiss="modal">{closeButtonText}</button>)}
                {(okButtonText && !handleSubmit) && (<button type="button" className="btn btn-sm btn-primary" onClick={onOkButtonClick}>{okButtonText}</button>)}
                {handleSubmit && (<CustomButton isLoading={isLoading} isSubmit className="btn btn-sm btn-primary">{okButtonText}</CustomButton>)}
              </div>
            </form>
          </div>
        </div>
      </div>
    );
}

Modal.defaultProps = {
    children: undefined,
    extraHeader: undefined,
    handleSubmit: undefined,
    extraFooter: undefined,
    show: false,
    isLoading: false,
    isScrollable: false,
    onClose: null,
    large: false,
    onShow: null,
    closeButtonText: null,
    onOkButtonClick: null,
    okButtonText: null,
};
export default React.memo(Modal);
