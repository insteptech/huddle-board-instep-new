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

// export const formatDates = (startDate: any, endDate: any) => {
//   // Helper function to format date
//   const formatDate = (date: any, isEndOfDay: any) => {
//     let incomingDate = new Date(date);
//     const year = incomingDate?.getFullYear();
//     const month = String(incomingDate?.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
//     const day = String(incomingDate?.getDate()).padStart(2, '0');
//     const hours = isEndOfDay ? '23' : '00';
//     const minutes = isEndOfDay ? '59' : '00';
//     const seconds = isEndOfDay ? '59' : '00';

//     return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
//   }

//   const startFormatted = formatDate(startDate, false);
//   const endFormatted = formatDate(endDate, true);

//   return {
//     start: startFormatted,
//     end: endFormatted
//   };
// }

// export const formatDates = (startDate: any, endDate: any) => {
//   // const timezone: string = I ntl.DateTimeFormat().resolvedOptions().timeZone;
//   const timezone: string = "US/Pacific";

//   // Define the start of the day in IST
//   const startDateTimeIST = moment.tz(startDate, timezone).startOf('day');

//   // Define the end of the day in IST
//   const endDateTimeIST = moment.tz(startDate, timezone).endOf('day');

//   // Convert IST dateTimes to UTC
//   const startDateTimeUTC = startDateTimeIST.clone().tz("UTC");
//   const endDateTimeUTC = endDateTimeIST.clone().tz("UTC");

//   return {
//     start: startDateTimeUTC.format(),
//     end: endDateTimeUTC.format()
//   };
// }

// export const formatDates = (startDate: any, endDate: any) => {
//   // Define the timezone as US/Pacific
//   const pacificTimezone = "America/Los_Angeles";

//   // Convert startDate from IST to Pacific Time Zone and set time to 00:00:01
//   const startDatePST = new Date(startDate).toLocaleString("en-US", {
//     timeZone: pacificTimezone,
//   });
//   const startDatePacific = new Date(startDatePST);
//   startDatePacific.setHours(0, 0, 1, 0); // Set time to 00:00:01 PST

//   // Convert endDate from IST to Pacific Time Zone and set time to 23:59:59
//   const endDatePST = new Date(endDate).toLocaleString("en-US", {
//     timeZone: pacificTimezone,
//   });
//   const endDatePacific = new Date(endDatePST);
//   endDatePacific.setHours(23, 59, 59, 0); // Set time to 23:59:59 PST

//   // Function to format date to ISO string with .00 milliseconds
//   const formatDateToUTC = (date: Date) => {
//     // Convert date to UTC
//     const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
//     // Get the ISO string and remove the milliseconds part
//     const isoString = utcDate.toISOString();
//     // Return ISO string with exactly .00 milliseconds
//     return isoString.replace(/\.\d{3}Z$/, '.00Z');
//   };

//   return {
//     start: formatDateToUTC(startDatePacific),
//     end: formatDateToUTC(endDatePacific),
//   };
// };


export const formatDates = (startDate: any, endDate: any) => {
  // Define the timezone as US/Pacific
  const pacificTimezone = "America/Los_Angeles";

  // Convert startDate to Pacific Time Zone and set time to 00:00:01
  const startDatePST = new Date(startDate).toLocaleString("en-US", {
    timeZone: pacificTimezone,
  });
  const startDatePacific = new Date(startDatePST);
  startDatePacific.setHours(0, 0, 0, 0); // Set time to 00:00:01 PST

  const endDatePST = new Date(endDate).toLocaleString("en-US", {
    timeZone: pacificTimezone,
  });
  const endDatePacific = new Date(endDatePST);
  endDatePacific.setHours(23, 59, 59, 0); // Set time to 23:59:59 PST

  startDatePacific.setHours(startDatePacific.getHours() + 7);
  endDatePacific.setHours(endDatePacific.getHours() + 7);

  // Function to format date to ISO string without milliseconds
  const formatDateToUTC = (date: Date) => {
    // Convert date to UTC
    const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    // Get the ISO string and remove the milliseconds part
    const isoString = utcDate.toISOString();
    // Return ISO string without milliseconds
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
  console.log(searchParams.toString(), "searchParams as string");
  console.log(searchParams.has("slug"), "has slug?");
  
  return searchParams.has("slug");
};

