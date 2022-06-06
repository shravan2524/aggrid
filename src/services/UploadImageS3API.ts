import toast from 'react-hot-toast';
import { BACKEND_API } from '../app/config';

type IProps = {
  s3Url: string;
  fileDropZone: null;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

// GET S3 URL
export async function GetS3Url() {
  const options: RequestInit = {
    method: 'GET',
  };

  const apiUrl = `${BACKEND_API}/api/v1/pre-signed-url/`;
  const response = await fetch(apiUrl, options);

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    toast.error(message);
  }
  return response.json();
}

// UPLOAD API
export async function uploadImageAPI({
  s3Url,
  fileDropZone,
  setLoading,
}: IProps) {
  try {
    const options: RequestInit = {
      method: 'PUT',
      body: fileDropZone,
    };
    setLoading(true);
    const response = await fetch(s3Url, options);
    if (response.ok) {
      setLoading(false);
    }
  } catch (e) {
    toast.error("Error");
  }
}
