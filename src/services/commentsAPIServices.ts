import { convertToObject } from 'typescript';
import { tenantUuid } from 'state/tenants/helper';
import { BACKEND_API } from '../app/config';

export interface CommentType {
}

export async function fetchCommentsData(): Promise<Comment[]> {
  const options: RequestInit = {
    method: 'GET',
    credentials: 'include',
  };
  const apiUrl = `${BACKEND_API}/api/v1/9a5f05a4-0076-46e0-8185-a0ebc8a1e8d0/comments//Files`;
  const response = await fetch(apiUrl, options);
  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
}

export async function postComments(payload): Promise<Comment[]> {
  const options: RequestInit = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ ...payload.Comments }),
  };
  const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid}/comments/`;
  // const apiUrl = 'https://beta.finkraft.ai/api/v1//comments/';
  const response = await fetch(apiUrl, options);
  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
}
