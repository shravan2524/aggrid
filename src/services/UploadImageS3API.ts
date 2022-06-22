import axios from 'axios';
import toast from 'react-hot-toast';
import { BACKEND_API } from 'app/config';

const API = `${BACKEND_API}/api/v1/pre-signed-url`;

// GET ID
function getIdFunction(file: File) {
  return axios.post(`${API}/initializeMultipartUpload`, {
    fileName: file ? file.name : '',
  });
}

// GET PRE-URL
function getS3Function(Key: any, uploadCount: any, uploadId: any) {
  return axios.post(`${API}/getUploadPart`, {
    fileName: Key,
    partNumber: uploadCount,
    uploadId,
  });
}

// PUT
function putObjectsFunction(preSignedUrl: any, file: any) {
  return axios.put(preSignedUrl, file);
}
// COMPLETE
function completeFunction(Key: any, multiUploadArray: any, uploadId: any) {
  return axios.post(`${API}/completeUpload`, {
    fileName: Key,
    parts: multiUploadArray,
    uploadId,
  });
}

// FINAL API'S
export async function MutPart({ setLoading }, file: File) {
  try {
    const getUrl = await getIdFunction(file);
    const { uploadId, Key } = getUrl.data;
    const multiUploadArray = <any>[];
    const chunkSize = 5 * 1024 * 1024; // 5MiB
    const chunkCount = Math.floor(file.size / chunkSize) + 1;
    // console.log(`chunkCount: ${chunkCount}`);

    //   LOOP
    for (let uploadCount = 1; uploadCount < chunkCount + 1; uploadCount++) {
      const start = (uploadCount - 1) * chunkSize;
      const end = uploadCount * chunkSize;
      const fileBlob = uploadCount < chunkCount ? file.slice(start, end) : file.slice(start);

      //    GET URL
      /* eslint-disable no-await-in-loop */
      const getSignedUrlRes = await getS3Function(Key, uploadCount, uploadId);
      const { preSignedUrl } = getSignedUrlRes.data;

      // Upload S3 Url
      const uploadChunck = await putObjectsFunction(preSignedUrl, fileBlob);
      const EtagHeader = uploadChunck.headers.etag;
      const uploadPartDetails = {
        ETag: EtagHeader,
        PartNumber: uploadCount,
      };

      multiUploadArray.push(uploadPartDetails);
    }
    /* eslint-enable no-await-in-loop */

    // complete
    const completeUpload = await completeFunction(
      Key,
      multiUploadArray,
      uploadId,
    );

    return completeUpload.data;
  } catch (e) {
    toast.error('An error has occurred');
    setLoading(false);
  }
}
