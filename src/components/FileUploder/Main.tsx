import { hideModal, showModal } from 'app/utils/Modal';
import React, { useRef, useState } from 'react';
import { MutPart } from 'services/UploadImageS3API';
import UploadFileModel from './UploadMode';
import './Uploder.scss';

function ReactFileUploder() {
  const [fileDropZone, setFileDropZone] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number[]>([]);
  const [message, setMessage] = useState<any>([]);
  const progressInfosRef = useRef<any>([]);
  const modalId = 'add';

  // CALL API
  const UploadFile = async (i: any, file: File) => {
    MutPart({ setLoading }, file).then(() => {
      setMessage((prevMessage: any) => [
        ...prevMessage,
        `Uploaded the file successfully: ${file.name}`,
      ]);
    });
  };

  // UPLOAD FUNCTION
  const UploadFunction = () => {
    if (fileDropZone) {
      setLoading(true);
      const progressInf = fileDropZone.map((file: File) => ({
        percentage: 0,
        fileName: file.name,
      }));
      progressInfosRef.current = progressInf;

      const uploadPromises = fileDropZone.map((file: File, i: any) => UploadFile(i, file));
      Promise.all(uploadPromises);
      setMessage([]);
    }
  };

  // CALCULATE PROGRESS
  // const mapProgress = progress.map((i: any) => i.percentage);
  // const getSingleNumber = mapProgress.reduce(
  //   (prev: any, a: any) => a + (prev || 0),
  //   0,
  // );
  // const Total = Number(
  //   progress.length > 0
  //     ? (getSingleNumber / (progress.length > 0 ? progress.length : 0)).toFixed(
  //       0,
  //     )
  //     : 0,
  // );

  // CLOSE MODEL
  const Close = () => {
    hideModal(modalId);
    // if (Total === 100) {
    setFileDropZone(null);
    setProgress([]);
    setLoading(false);
    setMessage([]);
    // }
  };

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
                progress={0}
                UploadFunction={UploadFunction}
                loading={loading}
                fileDropZone={fileDropZone}
                setFileDropZone={setFileDropZone}
                message={message}
                setMessage={setMessage}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReactFileUploder;
