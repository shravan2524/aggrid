import React, { useEffect } from 'react';
import UploadButton from './UploadButton';
import Uploder from './Uploder';

interface IProps {
  fileDropZone: any;
  UploadFunction: () => void;
  loading: boolean;
  setFileDropZone: React.Dispatch<any>;
  progress:any
}

function UploadFileModel({
  UploadFunction,
  loading,
  fileDropZone,
  setFileDropZone,
  progress,
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
            progress={progress}
          />
        ) : (
          <Uploder setFileDropZone={setFileDropZone} />
        )}
      </div>
    </div>
  );
}

export default UploadFileModel;
