import { ICellRendererParams } from 'ag-grid-community';
import React from 'react';

type ActionsRendererProps = {
    params: ICellRendererParams;
    onEditClickCallback: (
        e: React.MouseEvent<HTMLButtonElement>,
        params: ICellRendererParams
    ) => void;
};

function ActionsRenderer(
    {
        params,
        onEditClickCallback,
    }: ActionsRendererProps,
) {
    return (
      <div className="d-flex btn-group align-items-center w-100 h-100">
        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={(e) => onEditClickCallback(e, params)}
        >
          <i className="fa-solid fa-pen-to-square" />
          {' '}
          Edit
        </button>
      </div>
    );
}

export default React.memo(ActionsRenderer);
