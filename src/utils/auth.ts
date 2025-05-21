export const getAccessToken = (): string | null => localStorage.getItem('accessToken');
export const getRefreshToken = (): string | null => localStorage.getItem('refreshToken');
export const setAccessToken = (token: string): void => localStorage.setItem('accessToken', token);
export const setRefreshToken = (token: string): void => localStorage.setItem('refreshToken', token);
export const clearTokens = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

interface DecodedToken {
  sub?: string;
  id?: string;
  role?: string;
  [key: string]: any;
}

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const getUserIdFromToken = (): string | null => {
  const token = getAccessToken();
  if (!token) return null;
  const decoded = decodeToken(token);
  return decoded?.id || null;
}; 