import bootstrap from 'bootstrap/dist/js/bootstrap.bundle';

const currentOpenedModal: any = {};

export function initBootstrapModal(modalId: string) {
  currentOpenedModal[modalId] = new bootstrap.Modal(`#${modalId}`);
}

export function showModal(modalId: string) {
  if (currentOpenedModal[modalId]) {
    currentOpenedModal[modalId].show(`#${modalId}`);
  }
}

export function hideModal(modalId: string) {
  if (currentOpenedModal[modalId]) {
    currentOpenedModal[modalId].hide();
  }
}
