import { ValueFormatterParams } from 'ag-grid-community';
import moment from 'moment';

export function agGridRowDrag(params) {
  // only rows that are NOT groups should be draggable
  return !params.node.group;
}

export function agGridDateFormatter(params: ValueFormatterParams) {
  return moment(params.value).format('LLL');
}
