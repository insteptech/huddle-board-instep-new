import * as moment from 'moment';
import 'moment-timezone';
// import { useSearchParams, useRouter } from 'next/navigation';
import { sessionKeys } from "./auth";

export const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
// const searchParam = useSearchParams();
export const cookieName = { jwtToken: 'jwt-token' };

export const setCookie = (cname: any, cvalue: any, exdays: any) => {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  const expires = 'expires=' + d;
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
};

export const getCookie = (cname: any) => {
  const name = cname + '=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
};

export const deleteCookie = (name: string) => {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

export const getTime = (timestamp: string) => {
  const date = new Date(timestamp);

  // Convert to Pacific Time using toLocaleString with the appropriate time zone
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Los_Angeles',
  };

  // Get the formatted time
  const formattedTime = date.toLocaleString('en-US', options);

  return formattedTime;
}

export const urlParams = (params: any) => {
  const query = Object.entries(params)
    .filter(([key, value]: any) => {
      return Array.isArray(value) ? value.length > 0 : value !== '';
    })
    .map(([key, value]: any) => `${encodeURIComponent(key)}=${Array.isArray(value) ? JSON.stringify(value) : encodeURIComponent(value)}`)
    .join('&');
  return query;
}

export const getCurrentDateFormatted = (date?: any) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentDate = new Date(date);
  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = months[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  return `${day} ${month} ${year}`;
}

export const formatDates = (startDate: any, endDate: any) => {
  const pacificTimezone = "America/Los_Angeles";

  const startDatePST = new Date(startDate).toLocaleString("en-US", {
    timeZone: pacificTimezone,
  });
  const startDatePacific = new Date(startDatePST);
  startDatePacific.setHours(0, 0, 0, 0); 

  const endDatePST = new Date(endDate).toLocaleString("en-US", {
    timeZone: pacificTimezone,
  });
  const endDatePacific = new Date(endDatePST);
  endDatePacific.setHours(23, 59, 59, 0); 
  startDatePacific.setHours(startDatePacific.getHours() + 8);
  endDatePacific.setHours(endDatePacific.getHours() + 8);

  const formatDateToUTC = (date: Date) => {
    const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    const isoString = utcDate.toISOString();
    return isoString.replace(/\.\d{3}Z$/, 'Z');
  };

  return {
    start: formatDateToUTC(startDatePacific),
    end: formatDateToUTC(endDatePacific),
  };
};


export const deleteLocalStorage = () => {
  const { accessToken, slugKey, refreshToken, huddleBoardConfig } = sessionKeys;
  localStorage.removeItem(accessToken);
  localStorage.removeItem(refreshToken);
  localStorage.removeItem(slugKey);
  localStorage.removeItem(huddleBoardConfig);
}

export const parseDate = (dd: any) => {
  let day = parseInt(dd, 10); // convert dd to number
  const month = day > 28 ? (day > 30 ? 12 : 11) : (day > 21 ? 10 : (day > 14 ? 9 : (day > 7 ? 8 : 7)));
  const year = new Date().getFullYear();
  return new Date(`${month}/${day}/${year}`);
}

export const isSlug = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.has("slug");
};

