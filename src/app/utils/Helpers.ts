import bootstrap from 'bootstrap/dist/js/bootstrap.bundle';
import { toast } from 'react-hot-toast';

export function agGridRowDrag(params) {
  // only rows that are NOT groups should be draggable
  return !params.node.group;
}

export function showBootstrapModal(modalId: string): void {
  const modal = new bootstrap.Modal(`#${modalId}`);
  modal.show({});
}
