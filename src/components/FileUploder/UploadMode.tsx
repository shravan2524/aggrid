import React, { useEffect } from 'react';
import UploadButton from './UploadButton';
import Uploder from './Uploder';

interface IProps {
  fileDropZone: null;
  UploadFunction: () => void;
  loading: boolean;
  setFileDropZone: React.Dispatch<React.SetStateAction<null>>;
}

function UploadFileModel({
  UploadFunction,
  loading,
  fileDropZone,
  setFileDropZone,
}: IProps) {
  return (
    <div>
      <div className="drop">
        {fileDropZone ? (
          <UploadButton
            file={fileDropZone}
            UploadFunction={UploadFunction}
            loading={loading}
            setFileDropZone={setFileDropZone}
          />
        ) : (
          <Uploder setFileDropZone={setFileDropZone} />
        )}
      </div>
    </div>
  );
}

export default UploadFileModel;
