import bootstrap from 'bootstrap/dist/js/bootstrap.bundle';

const currentOpenedModal: any = {};
export function showModal(modalId: string) {
  currentOpenedModal[modalId] = new bootstrap.Modal(`#${modalId}`);

  if (currentOpenedModal[modalId]) {
    currentOpenedModal[modalId].show(`#${modalId}`);
  }
}

export function hideModal(modalId: string) {
  if (currentOpenedModal[modalId]) {
    currentOpenedModal[modalId].hide();
    delete (currentOpenedModal[modalId]);
  }
}
