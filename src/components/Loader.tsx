import React, { useEffect } from 'react';
import 'nprogress/nprogress.css';
import ProgressBar from 'app/utils/ProgressBar';

function LoaderComponent() {
  return (
    <div className="position-absolute h-100 w-100 d-flex justify-content-center align-items-center">
      <div className="d-flex justify-content-center align-items-center flex-column">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div>
          {' '}
          <small className="text-muted">Loading, please wait ...</small>
        </div>
      </div>
    </div>
  );
}

export default function Loader() {
  useEffect(() => {
    ProgressBar.start();
    return () => {
      ProgressBar.done();
    };
  }, []);

  return (<LoaderComponent />);
}
