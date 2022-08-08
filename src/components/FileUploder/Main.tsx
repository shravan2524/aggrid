import { useAppDispatch } from 'app/hooks';
import { hideModal, showModal } from 'app/utils/Modal';
import React, { useCallback, useRef, useState } from 'react';
import { MutPart } from 'services/UploadImageS3API';
import { fetchFiles } from 'state/files/filesSlice';
import UploadFileModel from './UploadMode';
import './Uploder.scss';

function ReactFileUploder() {
  const [fileDropZone, setFileDropZone] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number[]>([]);
  const [message, setMessage] = useState<any>([]);
  const progressInfosRef = useRef<any>([]);
  const dispatch = useAppDispatch();
  const modalId = 'add';
  //   const chunkSize = 5 * 1024 * 1024; // 5MiB
  //   const mapd = fileDropZone && fileDropZone.map((r:any) => Math.floor(r.size / chunkSize) + 1)
  //  const chunkTotal = mapd &&mapd.reduce(
  //       (prev: any, a: any) => a + (prev || 0),
  //       0,
  //     );
  // CALL API
  const UploadFile = async (i: any, file: File) => {
    const progressInf = [...progressInfosRef.current];
    MutPart({ setLoading }, file, (event: any) => {
      if (event.lengthComputable) {
        progressInf[i].percentage = Math.round(
          (100 * event.loaded) / event.total,
        );
        setProgress(progressInf);
      }
    }).then((data) => {
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
  const mapProgress = progress.map((i: any) => i.percentage);
  const getSingleNumber = mapProgress.reduce(
    (prev: any, a: any) => a + (prev || 0),
    0,
  );
  const Total = Number(
    progress.length > 0
      ? (getSingleNumber / (progress.length > 0 ? progress.length : 0)).toFixed(
        0,
      )
      : 0,
  );

  // CLOSE MODEL
  const Close = () => {
    hideModal(modalId);
    setFileDropZone(null);
    setProgress([]);
    setLoading(false);
    setMessage([]);
    dispatch(fetchFiles());
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-sm btn-success d-flex gap-2 align-items-center justify-content-center  flex-wrap"
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
                progress={Total}
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
