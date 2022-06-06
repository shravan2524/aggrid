import React from 'react';
import { SizeInMB } from './SizeInMb';
import { IFile } from './Types';

interface IProps {
  UploadFunction: () => void;
  file: IFile;
  loading: boolean;
  setFileDropZone: React.Dispatch<React.SetStateAction<null>>;
}

const UploadButton: React.FC<IProps> = ({
  file,
  UploadFunction,
  loading,
  setFileDropZone,
}) => {
  return (
    <>
      <div className="d-flex gap-2 justify-content-between py-2 px-4 border align-items-center mb-4 rounded flex-wrap">
        <i className="icon text-warning fas fa-file-image" />
        <div className="text-wrap">{file.name}</div>
        <p>
          Size:
          <strong>({SizeInMB(file.size)})</strong>
        </p>
      </div>
      <div className="d-grid gap-2">
        <button
          type="button"
          onClick={UploadFunction}
          className="btn btn-primary py-2 rounded shadow"
        >
          {loading ? (
            'Loading....'
          ) : (
            <span>
              UPLOAD
              <i className="mx-4 fas fa-cloud-upload" />
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            setFileDropZone(null);
          }}
          className="cancel btn flex-colo"
        >
          <p>Cancel</p>
        </button>
      </div>
    </>
  );
};

export default UploadButton;
