import { hideModal, showModal } from 'app/utils/Modal';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { GetS3Url, uploadImageAPI } from 'services/UploadImageS3API';
import UploadFileModel from './UploadMode';
import './Uploder.scss';

interface URL {
  url: string;
  KeyId: string;
}

function ReactFileUploder() {
  const [fileDropZone, setFileDropZone] = useState(null);
  const [s3Url, setS3Url] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [objectKey, setObjectKey] = useState<string>('');
  const modalId = 'add';

  const UploadFunction = () => {
    if (fileDropZone) {
      setLoading(true);
      GetS3Url({ setLoading }).then(({ url, KeyId }: URL) => {
        setS3Url(url);
        setObjectKey(KeyId);
      });
    }
  };

  useEffect(() => {
    if (s3Url) {
      uploadImageAPI({
        s3Url,
        fileDropZone,
        setLoading,
      }).then(() => {
        setFileDropZone(null);
        setS3Url('');
        toast.success('File Uploded.');
        hideModal(modalId);
      });
    }
  }, [s3Url, fileDropZone]);

  return (
    <>
      <button
        type="button"
        className="btn btn-sm btn-danger px-4 d-flex gap-2 align-items-center"
        onClick={() => showModal('add')}
      >
        <i className="fas fa-cloud-upload-alt" />
        Upload New File
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
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <UploadFileModel
                UploadFunction={UploadFunction}
                loading={loading}
                fileDropZone={fileDropZone}
                setFileDropZone={setFileDropZone}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReactFileUploder;
