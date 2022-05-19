// import Cookies from 'js-cookie';

export function getAccessToken(): string | null {
  return localStorage.getItem('accessToken');
}

export function setAccessToken(accessToken: string): void {
  localStorage.setItem('accessToken', accessToken);
}

export function setUserDetailsToLocal(userDetails): void {
  localStorage.setItem('userDetails', JSON.stringify(userDetails));
}

export function isAuthenticated() : boolean {
  return getAccessToken() !== null;
}

export function clearAllTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userDetails');
  // Cookies.remove('appSession', { path: '/', domain: 'localhost', secure: true });
}

export function logOut() {
  clearAllTokens();
}
