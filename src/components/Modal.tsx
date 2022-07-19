import React, {
    useEffect, useMemo, useRef,
} from 'react';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle';

interface ModalProps {
    children: React.ReactElement,
    title: string,
    show?: boolean,
    onClose?: () => void,
    onShow?: () => void,
    closeButtonText?: string,
    onOkButtonClick?: (e: React.MouseEvent<HTMLButtonElement> | undefined) => void,
    okButtonText?: string
}

let modal:bootstrap.Modal | null = null;

function Modal({
                   children,
                   title,
                   show,
                   onClose,
                   onShow,
                   closeButtonText,
                   onOkButtonClick,
                   okButtonText,
    }: ModalProps) {
    const modalRef = useRef<bootstrap.Modal>();

    const modalId = useMemo(() => Math.floor(Math.random() * 1000), []);

    useEffect(() => {
        if (!modal) {
            modal = new bootstrap.Modal(modalRef.current);
        }

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
    }, []);

    useEffect(() => {
        if (modal) {
            if (show) {
                modal.show(modalRef.current);
            } else {
                modal.hide();
            }
        }
    }, [show]);

    return (
      <div
        ref={modalRef}
        className="modal fade"
        id={`modal${modalId}`}
        aria-labelledby={`modal${modalId}Label`}
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={`modal${modalId}Label`}>{title}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              {children}
            </div>
            <div className="modal-footer">
              {closeButtonText && (<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">{closeButtonText}</button>)}
              {okButtonText && (<button type="button" className="btn btn-primary" onClick={onOkButtonClick}>{okButtonText}</button>)}
            </div>
          </div>
        </div>
      </div>
    );
}

Modal.defaultProps = {
    show: false,
    onClose: null,
    onShow: null,
    closeButtonText: null,
    onOkButtonClick: null,
    okButtonText: null,
};
export default React.memo(Modal);
