import toast from 'react-hot-toast';
import axios from 'axios';
import { BACKEND_API } from '../app/config';

type IProps = {
  s3Url: string;
  fileDropZone: any;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setProgress: React.Dispatch<any>;
};

interface URL {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fileDropZone: any;
}

// GET S3 URL
export async function GetS3Url({ setLoading, fileDropZone }: URL) {
  try {
    const res = await axios.post(`${BACKEND_API}/api/v1/pre-signed-url`, {
      fileName: fileDropZone ? fileDropZone.name : '',
    });
    return res.data;
  } catch (e) {
    toast.error('An error has occurred');
    setLoading(false);
  }
}

// UPLOAD API
export async function uploadImageAPI({
  s3Url,
  fileDropZone,
  setLoading,
  setProgress,
}: IProps) {
  try {
    await axios.put(s3Url, fileDropZone, {
      onUploadProgress: (event) => {
        const percent = Math.floor((event.loaded / event.total) * 100);
        setProgress(percent);
      },
    });
    setLoading(false);
  } catch (e) {
    toast.error('Error');
    setLoading(false);
  }
}
