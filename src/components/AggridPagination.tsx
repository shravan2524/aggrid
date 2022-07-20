import React from 'react';

type Props = {
  gridRef: React.MutableRefObject<any>;
  totalPages: number;
  currentPage: number;
};

export function AggridPagination({ gridRef, totalPages, currentPage }: Props) {
  const onBtFirst = () => {
    gridRef.current!.api.paginationGoToFirstPage();
  };

  const onBtLast = () => {
    gridRef.current!.api.paginationGoToLastPage();
  };

  const onBtNext = () => {
    gridRef.current!.api.paginationGoToNextPage();
  };

  const onBtPrevious = () => {
    gridRef.current!.api.paginationGoToPreviousPage();
  };
  return (
    <div>
      {totalPages > 1 && (
        <div className="w-100 d-flex align-items-center justify-content-end border border-top-0 border-secondary py-2 px-4">
          <button
            type="button"
            onClick={onBtFirst}
            className="btn text-secondary"
          >
            <i className="fas fa-caret-left" />
          </button>
          <button
            type="button"
            onClick={onBtPrevious}
            className="btn text-secondary"
          >
            <i className="fas fa-angle-left" />
          </button>
          <div className="px-2">
            Page
            {' '}
            <b>{currentPage}</b>
            of
            {' '}
            <b>{totalPages}</b>
          </div>
          <button
            type="button"
            onClick={onBtNext}
            className="btn text-secondary"
          >
            <i className="fas fa-angle-right" />
          </button>
          <button
            type="button"
            onClick={onBtLast}
            className="btn text-secondary"
          >
            <i className="fas fa-caret-right" />
          </button>
        </div>
      )}
    </div>
  );
}
