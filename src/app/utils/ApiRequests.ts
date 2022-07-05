import { toast } from 'react-hot-toast';
import { LOGOUT_LINK } from '../config';

export async function handleRequestError(response) {
  const responseCode = response.status;
  let responseText = response.statusText;

  // Reading the error message from the server
  const serverResponsePromise = await response.text();
  const serverResponseData = JSON.parse(serverResponsePromise);

  if (serverResponseData.error) {
    responseText = serverResponseData.error;
  }

  if (responseCode === 401) {
    toast.error('HTTP Error 401 - Unauthorized.');
    window.location.href = LOGOUT_LINK;
  } else {
    toast.error(`HTTP Error ${responseCode} ${responseText}`);
  }
  throw new Error(`HTTP Error ${responseCode} ${responseText}`);
}
