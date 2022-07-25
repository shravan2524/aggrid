import { TenantApiRequest } from '../app/utils/ApiRequests';

interface Contact {
  email: string,
  firstName?: string,
  lastName?: string,
  fullName?: string,
  phoneNumber?: string,
  profilePicture?: string,
}
export interface ItemType {
  id?: number,
  contact?: Contact,
  email: string,
  firstName: string,
  lastName: string,
  status?: string,
  createdAt?: Date,
  createdBy?: number,
  creator?: any | null,
  updatedAt?: Date,
  updatedBy?: number,
  updator?: any | null,
  roles?: Array<number> | null,
  groups?: Array<number> | null,
}

export async function readAll(): Promise<ItemType[]> {
  return TenantApiRequest('users');
}

export async function readOne(id: number): Promise<ItemType> {
  return TenantApiRequest(`users/${id}`);
}

export async function create(data: ItemType): Promise<ItemType> {
  return TenantApiRequest('users', 'POST', data);
}

export async function update(payload: ItemType): Promise<ItemType> {
  return TenantApiRequest(`users/${payload.id}`, 'PUT', payload);
}

export async function patch(payload: ItemType): Promise<ItemType> {
  return TenantApiRequest(`users/${payload.id}`, 'PATCH', payload);
}
export async function DeleteUser(id: ItemType): Promise<ItemType> {
  return TenantApiRequest(`users/${id}`, 'DELETE');
}

export async function ActivateUser(id: ItemType): Promise<ItemType> {
  return TenantApiRequest(`users/activate/${id}`, 'GET');
}

export async function DeactivateUser(id: ItemType): Promise<ItemType> {
  return TenantApiRequest(`users/deactivate/${id}`, 'GET');
}
