import bootstrap from 'bootstrap/dist/js/bootstrap.bundle';

const currentOpenedModal: any = {};
export function initBootstrapModal(modalId: string) {
  currentOpenedModal[modalId] = new bootstrap.Modal(`#${modalId}`);
}

export function showModal(
  modalId: string,
  onModalHiddenCallback: (any) => void = () => null,
) {
  currentOpenedModal[modalId] = new bootstrap.Modal(`#${modalId}`);

  if (currentOpenedModal[modalId]) {
    currentOpenedModal[modalId].show(`#${modalId}`);

    if (onModalHiddenCallback) {
      const myModalEl = document.getElementById(modalId);
      if (myModalEl) {
        myModalEl.addEventListener('hidden.bs.modal', () => {
          onModalHiddenCallback(modalId);
          if (currentOpenedModal[modalId]) {
            delete (currentOpenedModal[modalId]);
          }
        });
      }
    }
  }
}

export function hideModal(modalId: string, callback: () => void = () => null) {
  if (currentOpenedModal[modalId]) {
    currentOpenedModal[modalId].hide();
    delete (currentOpenedModal[modalId]);
    if (callback) {
      callback();
    }
  }
}
