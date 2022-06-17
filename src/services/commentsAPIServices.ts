import { convertToObject } from 'typescript';
import { BACKEND_API } from '../app/config';

export interface CommentType {
}

export async function fetchCommentsData(): Promise<Comment[]> {
  console.log(BACKEND_API);
  const options: RequestInit = {
    method: 'GET',
    credentials: 'include',
  };
  const apiUrl = `${BACKEND_API}/api/v1/comments/`;
  const response = await fetch(apiUrl, options);
  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
}

export async function postComments(payload): Promise<Comment[]> {
//   console.log(BACKEND_API, 'shravanca');
  const options: RequestInit = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    credentials: 'include',
    body: JSON.stringify({ ...payload.comment }),
  };
  const apiUrl = `${BACKEND_API}/api/v1/comments/`;
  const response = await fetch(apiUrl, options);
  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
}
