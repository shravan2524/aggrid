import toast from 'react-hot-toast';
import axios from 'axios';
import { BACKEND_API } from '../app/config';

// GET PRE-SIGNED URL
function getUrlFunction(file: File) {
  return axios.post(`${BACKEND_API}/api/v1/pre-signed-url`, {
    fileName: file ? file.name : '',
  });
}

// PUT OBJECTS IN AWS S3
function putObjectsFunction(getUrl: any, file: File, onUploadProgress: any) {
  return axios.put(getUrl.data.url, file, {
    onUploadProgress,
  });
}

// FINAL API'S
export async function GetS3Url(
  { setLoading },
  file: File,
  onUploadProgress: any,
) {
  try {
    setLoading(true);
    const getUrl = await getUrlFunction(file);
    if (getUrl) {
      await putObjectsFunction(getUrl, file, onUploadProgress);
    }

    return getUrl;
  } catch (e) {
    toast.error('An error has occurred');
    setLoading(false);
  }
}
