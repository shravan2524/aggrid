import { hideModal, showModal } from 'app/utils/Modal';
import React, { useEffect, useState } from 'react';
import { GetS3Url } from 'services/UploadImageS3API';
import UploadFileModel from './UploadMode';
import './Uploder.scss';

function ReactFileUploder() {
  const [fileDropZone, setFileDropZone] = useState<any>();
  const [results, setResults] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number[]>([]);
  const modalId = 'add';

  const UploadFunction = () => {
    if (fileDropZone) {
      setResults(true);
      fileDropZone.forEach(async (file: File) => {
        GetS3Url({ setLoading, file, setProgress });
      });
    }
  };

  const Close = () => {
    hideModal(modalId);
    if (progress[0] === 100) {
      hideModal(modalId);
      setFileDropZone(null);
      setProgress([0]);
      setLoading(false);
      setResults(false);
    }
  };

  useEffect(() => {}, [fileDropZone, results, progress]);

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
                <h5 className="text-success">Files Selected:</h5>
              ) : (
                <h5>Upload File:</h5>
              )}
              <button type="button" className="btn-close" onClick={Close} />
            </div>
            <div className="modal-body">
              <UploadFileModel
                progress={progress.reduce((prev, a) => a + (prev || 0), 0)}
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
