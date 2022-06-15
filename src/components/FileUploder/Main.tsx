import { hideModal, showModal } from 'app/utils/Modal';
import React, { useEffect, useState } from 'react';
import { GetS3Url } from 'services/UploadImageS3API';
import UploadFileModel from './UploadMode';
import './Uploder.scss';

function ReactFileUploder() {
  const [fileDropZone, setFileDropZone] = useState<any>();
  const [results, setResults] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<any>();
  const modalId = 'add';

  const UploadFunction = () => {
    if (fileDropZone) {
      GetS3Url({ setLoading, fileDropZone, setProgress }).then(() => {
        setResults(true);
      });
    }
  };

  const Close = () => {
    hideModal(modalId);
    setFileDropZone(null);
    setProgress(null);
    setResults(false);
    setLoading(false);
  };

  useEffect(() => {
  }, [fileDropZone, results]);

  return (
    <>
      <button
        type="button"
        className="btn btn-sm btn-danger px-4 d-flex gap-2 align-items-center"
        onClick={() => showModal('add')}
      >
        <i className="fas fa-cloud-upload-alt" />
        Upload New Files
      </button>
      {/* MODEL */}
      <div
        className="modal fade"
        id={modalId}
        aria-labelledby={`new${modalId}Label`}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              {fileDropZone ? (
                <h5 className="text-success">File Selected:</h5>
              ) : (
                <h5>Upload File:</h5>
              )}
              <button type="button" className="btn-close" onClick={Close} />
            </div>
            <div className="modal-body">
              <UploadFileModel
                progress={progress}
                UploadFunction={UploadFunction}
                loading={loading}
                fileDropZone={fileDropZone}
                setFileDropZone={setFileDropZone}
                results={results}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReactFileUploder;
