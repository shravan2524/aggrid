import { IFilterParams } from '@ag-grid-community/core';
// @ts-ignore
import React, {
  useImperativeHandle, useState, forwardRef, useEffect,
} from 'react';

export default forwardRef((props: IFilterParams, ref) => {
  const [statusText, setStatusText] = useState<string>('---');

  const {
    filterChangedCallback, api, colDef, column, columnApi, context,
  } = props;

  // expose AG Grid Filter Lifecycle callbacks
  useImperativeHandle(ref, () => ({

    isFilterActive() {
      return statusText != null && statusText !== '---' && statusText !== '';
    },

    doesFilterPass(params) {
      const { node } = params;

      const value = props.valueGetter({
        api,
        colDef,
        column,
        columnApi,
        context,
        data: node.data,
        getValue: (field) => node.data[field],
        node,
      });

      return value.toString().toLowerCase() === statusText;
    },

    getModel() {
      // eslint-disable-next-line react/no-this-in-sfc
      if (!this.isFilterActive()) {
        return null;
      }

      return { value: statusText };
    },

    setModel(model) {
      setStatusText(model == null ? null : model.value);
    },

  }));

  const onStatusChange = (event) => {
    setStatusText(event.target.value);
  };

  useEffect(() => {
    filterChangedCallback();
  }, [statusText]);

  return (
    <div className="m-2">
      <label htmlFor="statusFilter" className="form-label">Status</label>
      <select
        className="form-select"
        id="statusFilter"
        aria-label="Default select example"
        onChange={onStatusChange}
        value={statusText}
      >
        <option value="---">---</option>
        <option value="active">Active</option>
        <option value="invited">Invited</option>
        <option value="deactivated">Deactivated</option>
      </select>
    </div>
  );
});
