import toast from 'react-hot-toast';
import axios from 'axios';
import { BACKEND_API } from '../app/config';

interface URL {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  file: any;
  setProgress: React.Dispatch<React.SetStateAction<number[]>>;
}

// GET PRE-SIGNED URL
function getUrlFunction(file: File) {
  return axios.post(`${BACKEND_API}/api/v1/pre-signed-url`, {
    fileName: file ? file.name : '',
  });
}

// PUT OBJECTS IN AWS S3
function putObjectsFunction(getUrl, file: File, setProgress) {
  return axios.put(getUrl.data.url, file, {
    onUploadProgress: (event: any) => {
      const percent = Math.floor((event.loaded / event.total) * 100);
      setProgress([percent]);
    },
  });
}

// FINAL API'S
export async function GetS3Url({ setLoading, file, setProgress }: URL) {
  try {
    setLoading(true);
    const getUrl = await getUrlFunction(file);
    if (getUrl) {
      await putObjectsFunction(getUrl, file, setProgress);
      console.log(getUrl.data);
    }
  } catch (e) {
    toast.error('An error has occurred');
    setLoading(false);
  }
}
