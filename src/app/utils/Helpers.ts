export function agGridRowDrag(params) {
  // only rows that are NOT groups should be draggable
  return !params.node.group;
}
