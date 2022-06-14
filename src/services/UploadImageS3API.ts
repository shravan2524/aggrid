import toast from 'react-hot-toast';
import axios from 'axios';
import { BACKEND_API } from '../app/config';

interface URL {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fileDropZone: any;
  setProgress: React.Dispatch<any>;
}

// GET PRE-SIGNED URL
function getUrlFunction(file) {
  return axios.post(`${BACKEND_API}/api/v1/pre-signed-url`, {
    fileName: file ? file.name : '',
  });
}

// PUT OBJECTS IN AWS S3
function putObjectsFunction(getUrl, file, setProgress) {
  return axios.put(getUrl.data.url, file, {
    onUploadProgress: (event) => {
      const percent = Math.floor((event.loaded / event.total) * 100);
      setProgress(percent);
    },
  });
}

// FINAL API'S
export async function GetS3Url({ setLoading, fileDropZone, setProgress }: URL) {
  try {
    setLoading(true);
    fileDropZone.forEach(async (file: any) => {
      const getUrl = await getUrlFunction(file);
      await putObjectsFunction(getUrl, file, setProgress);
      return getUrl.data;
    });
  } catch (e) {
    toast.error('An error has occurred');
    setLoading(false);
  }
}
