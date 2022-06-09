import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface Iprops {
  setFileDropZone: React.Dispatch<React.SetStateAction<null>>;
}

function Uploder({ setFileDropZone }: Iprops) {
  //   onDrop
  const onDrop = useCallback((acceptedFiles: any) => {
    setFileDropZone(acceptedFiles[0]);
  }, []);

  //   DropZone Hook
  const {
    getRootProps, getInputProps, isDragReject,
  } = useDropzone({
    onDrop,
    multiple: false,
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`flex-colo rounded upload border ${
        isDragReject ? 'border-danger' : 'border-info'
      }`}
    >
      <input {...getInputProps()} />
      <i className="fas fa-file-import uploadIcon" />
      <p className="fw-bold my-2">
        Drag & Drop or
        <span className="text-warning"> Browser</span>
      </p>

      <p
        className={`text-small ${isDragReject ? 'text-danger' : 'fst-italic'}`}
      >
        <b>File : </b>
        {isDragReject ? 'Only Supports' : 'Require'}
        : (1) File
      </p>
    </div>
  );
}

export default Uploder;
