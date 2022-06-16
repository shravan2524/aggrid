import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface Iprops {
  setFileDropZone: React.Dispatch<any>;
}

function Uploder({ setFileDropZone }: Iprops) {
  //   onDrop
  const onDrop = useCallback((acceptedFiles: any) => {
    setFileDropZone(acceptedFiles);
  }, []);

  //   DropZone Hook
  const {
    getRootProps, getInputProps, isDragReject,
  } = useDropzone({
    onDrop,
    multiple: true,
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
      {/* <p
        className={`text-small ${isDragReject ? 'text-danger' : 'fst-italic'}`}
      >
        {isDragReject ? 'Only Supports' : 'Require'}
        : (5) Files
      </p> */}
    </div>
  );
}

export default Uploder;
