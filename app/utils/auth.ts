import axios from 'axios';
import jwt from 'jsonwebtoken';
import { deleteLocalStorage } from './helper';
import { access } from 'fs';

export const API_URL = process.env.REACT_APP_API_URL;

export const decodeToken = function (token: any) {
  if (!token) {
    return null;
  }
  const decoded = jwt.decode(token);
  return decoded;
};

export function isAuthenticated(token?: string | null) {
  if (!token) {
    return false;
  }
  const { exp }: any = decodeToken(token);

  let currentDate = new Date();
  currentDate.setHours(currentDate.getHours() + 2);
  var a = Math.round(new Date(currentDate).getTime() + 1) / 1000;

  // try {
  //   const { exp }: any = decodeToken(token);
  //   if (exp > (new Date(currentDate))) {
  //     return true;
  //   }
  // } catch (err) {
  //   return false;
  // }
  // return false;
}

export function isTokenExpired(token?: string | null) {
  if (!token) {
    return true; // Token is missing
  }

  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  const decodedToken = JSON.parse(atob(base64));

  if (!decodedToken.exp) {
    return true; // Token doesn't have an expiration time
  }

  // JWT expiration time is in seconds, so convert it to milliseconds
  const expirationTime = decodedToken.exp * 1000;
  const currentTime = Date.now();

  // Calculate the difference between the current time and expiration time
  const timeDifference = expirationTime - currentTime;

  // Check if the token is expired (within 2 hours or 7200000 milliseconds)
  if (timeDifference < 7200000) {
    return true; // Token is expired
  } else {
    return false; // Token is still valid
  }
}


export const sessionKeys = { accessToken: "access_token", slugKey: "slug", refreshToken: "refresh_token", huddleBoardConfig: "huddleBoardConfig" };

export const getAndSetAccessToken = async (slug: any) => {
  const { accessToken, slugKey, refreshToken } = sessionKeys;
  const refresh = localStorage.getItem(refreshToken);
  const access = localStorage.getItem(accessToken);
  const userSlug = localStorage.getItem(slugKey);
  const isExpired = isTokenExpired(access);

  if (refresh && access && !isExpired) return;
  if (slug) {
    localStorage.setItem(slugKey, slug);
  }

  const fetchNewTokens = async () => {
    await axios.post(`${API_URL}slug-token/`, { slug: slug || userSlug }).then((response) => {
      if (response && response.data) {
        const { access: newAccessToken, refresh: newRefreshToken } = response.data;
        localStorage.setItem(accessToken, newAccessToken);
        localStorage.setItem(refreshToken, newRefreshToken);
        return;
      }
    }).catch((err) => {
      deleteLocalStorage();
      window.location.href = '/pageNotFound';
    })
  };

  const refreshTokens = async () => {
    const response = await axios.post(`${API_URL}token/refresh/`, { "refresh": refresh });
    if (response && response.data) {
      const { access: newAccessToken, refresh: newRefreshToken } = response.data;
      localStorage.setItem(accessToken, newAccessToken);
      localStorage.setItem(refreshToken, newRefreshToken);
      return;
    }
  };

  if (!refresh && !access) {
    await fetchNewTokens();
  } else if (refresh && access && isExpired) {
    await refreshTokens();
  }
};

export const accessToken = () => { return localStorage.getItem(sessionKeys.accessToken); }

export const notAuthenticated: any = () => {
  const { accessToken, slugKey, refreshToken } = sessionKeys;

  const refresh = localStorage.getItem(refreshToken);
  const access = localStorage.getItem(accessToken);
  const userSlug = localStorage.getItem(slugKey);
  const huddleBoardConfig = localStorage.getItem('huddleBoardConfig');

  if (refresh && access && userSlug && huddleBoardConfig) {
    return true
  } else false;
};


export const loginAuthentication: any = () => {
  const { accessToken, refreshToken } = sessionKeys;
  const email = localStorage.getItem("email");
  const refresh = localStorage.getItem(refreshToken);
  const access = localStorage.getItem(accessToken);
  const huddleBoardConfig = localStorage.getItem('huddleBoardConfig');

  if (refresh && access && email && huddleBoardConfig) {
    return true
  } else false;
};

export const refreshTokens = async () => {
  const refresh = localStorage.getItem("refresh_token");
  const payload = {
    'refresh': refresh
  }

  const response = await axios.post(`${API_URL}token/refresh/`, (payload));
  if (response && response.data) {
    const { access: newAccessToken, refresh: newRefreshToken } = response.data;
    localStorage.setItem("refresh_token", newAccessToken);
    localStorage.setItem("access_token", newRefreshToken);
    return;
  }
};