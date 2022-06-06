import { showModal } from 'app/utils/Modal';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { GetS3Url, uploadImageAPI } from 'services/UploadImageS3API';
import UploadButton from './UploadButton';
import Uploder from './Uploder';
import './Uploder.scss';

function ReactFileUploder() {
  const [fileDropZone, setFileDropZone] = useState(null);
  const [s3Url, setS3Url] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const UploadFunction = () => {
    if (fileDropZone) {
      setLoading(true);
      GetS3Url().then((Url) => {
        setS3Url(Url);
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
      });
    }
  }, [s3Url, fileDropZone]);

  return (
    <div className="flex-colo main">
      <div className="drop shadow-lg">
        {fileDropZone ? (
          <>
            <h5 className="mb-4 text-success">File Selected:</h5>
            <UploadButton
              file={fileDropZone}
              UploadFunction={UploadFunction}
              loading={loading}
              setFileDropZone={setFileDropZone}
            />
          </>
        ) : (
          <>
            <h5 className="mb-4">Upload Your File:</h5>
            <Uploder setFileDropZone={setFileDropZone} />
          </>
        )}
      </div>
    </div>
  );
}

export default ReactFileUploder;
