// import PngFileIconReact from "../assets/file_png.svg"
// import JpgFileIconReact from "../assets/file_jpg.svg?react"
// import GifFileIconReact from "../assets/file_gif.svg?react"
// import PdfFileIconReact from "../assets/file_pdf.svg?react"
// import Mp3FileIconReact from "../assets/file_mp3.svg?react"
// import GeneralFileIconReact from "../assets/file_general.svg?react"

// import PngFileIcon from "../assets/file_png.svg"
// import JpgFileIcon from "../assets/file_jpg.svg"
// import GifFileIcon from "../assets/file_gif.svg"
// import PdfFileIcon from "../assets/file_pdf.svg"
// import Mp3FileIcon from "../assets/file_mp3.svg"
// import GeneralFileIcon from "../assets/file_general.svg"
import { FileImage } from "lucide-react";
import {boolean} from "zod";

export function formatDateForLatestPost(dateString: string | number): string {
  if (typeof dateString == "number") {
    dateString = dateString * 1000;
  }
  const dateObject = new Date(dateString);
  const currentDate = new Date();
  const yesterday = new Date();
  yesterday.setDate(currentDate.getDate() - 1);

  if (dateObject.toDateString() === currentDate.toDateString()) {
    return dateObject.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (dateObject.toDateString() === yesterday.toDateString()) {
    return (
      "Yesterday " +
      dateObject.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  } else {
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1;
    const year = dateObject.getFullYear() % 100; // Get the last two digits of the year
    return `${day < 10 ? "0" + day : day}/${
      month < 10 ? "0" + month : month
    }/${year}`;
  }
}

export function formatDateFortPost(dateString: string): string {
  const dateObject = new Date(dateString);
  const currentDate = new Date();
  const yesterday = new Date();
  yesterday.setDate(currentDate.getDate() - 1);

  if (dateObject.toDateString() === currentDate.toDateString()) {
    return dateObject.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (dateObject.toDateString() === yesterday.toDateString()) {
    return (
      "Yesterday " +
      dateObject.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  } else {
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1;
    const year = dateObject.getFullYear() % 100; // Get the last two digits of the year
    return `${day < 10 ? "0" + day : day}/${
      month < 10 ? "0" + month : month
    }/${year} ${dateObject.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }
}

export function removeHtmlTags(htmlString: string): string {
  return htmlString.replace(/<[^>]*>/g, "");
}

export function checkAuthCookieExists(): boolean {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name] = cookie.trim().split("=");
    if (name === "Authorization") {
      return true;
    }
  }
  return false;
}

export function checkRefreshCookieExists(): boolean {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name] = cookie.trim().split("=");
    if (name === "RefreshToken") {
      return true;
    }
  }
  return false;
}

export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
  let lastFunc: ReturnType<typeof setTimeout>
  let lastRan: number
  return function(this: any, ...args: Parameters<T>) {
    const context = this
    if (!lastRan) {
      func.apply(context, args)
      lastRan = Date.now()
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(function() {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args)
          lastRan = Date.now()
        }
      }, limit - (Date.now() - lastRan))
    }
  }
}

export function getOtherUserId(chatGrpId: string, userid: string): string {
  const uuidArr = chatGrpId.split(" ");

  if (uuidArr[0] == userid) return uuidArr[1];

  return uuidArr[0];
}

export function isZeroEpoch(dateString: string) {
  if (dateString == "") {
    return true;
  }
  return (
    dateString == "0001-01-01T00:00:00Z" || dateString == "1970-01-01T00:00:00Z"
  );
}

function fallbackCopyTextToClipboard(text: string) {
  const textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    const msg = successful ? "successful" : "unsuccessful";
    console.log("Fallback: Copying text command was " + msg);
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }

  document.body.removeChild(textArea);
}

export function copyTextToClipboard(text: string) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(
    function () {
      console.log("Async: Copying to clipboard was successful!");
    },
    function (err) {
      console.error("Async: Could not copy text: ", err);
    }
  );
}

export function getCurrentUrl() {
  if (typeof window !== "undefined" && window.location) {
    const { protocol, host, pathname } = window.location;
    // const firstPathSegment = pathname.split('/')[1]; // Split path and get the first segment
    return `${protocol}//${host}${pathname}`;
  } else {
    console.error("This function can only be run in a browser environment.");
    return null;
  }
}

export function isInStandaloneMode(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator &&
      (window.navigator as any).standalone) ||
    document.referrer.includes("android-app://")
  );
}

// export function getFileSVGReact(fileName: string) {
//     const extension = fileName.split('.').pop()?.toLowerCase();
//
//     // Use a switch case to check the extension
//     switch (extension) {
//         case 'png':
//             return PngFileIconReact
//         case 'jpg':
//         case 'jpeg':
//             return JpgFileIconReact
//         case 'gif':
//             return GifFileIconReact
//         case 'pdf':
//             return PdfFileIconReact
//         case 'mp3':
//             return Mp3FileIconReact
//         default:
//             return GeneralFileIconReact
//     }
//
// }
export function isDateEmptyOrInvalid(date: any): boolean {
  // Check if date is not an instance of Date
  if (!(date instanceof Date)) {
    return true;
  }

  // Check if the date is invalid (Invalid Date returns NaN when checked with isNaN)
  if (isNaN(date.getTime())) {
    return true;
  }

  return false;
}


export function getNameInitials(fullName: string): string {
  const nameInitialsArray = fullName.split(" ") || [
    "Unknown",
  ];

  let nameInitial = nameInitialsArray[0][0].toUpperCase();

  if (nameInitialsArray?.length > 1) {
    nameInitial += nameInitialsArray[1][0].toUpperCase();
  }

  return nameInitial
}

export function formatDateForComment(dateString: string | number): string {
  if(typeof(dateString) == "number") {
    dateString = dateString * 1000
  }
  const dateObject = new Date(dateString);
  const currentDate = new Date();
  const yesterday = new Date();
  yesterday.setDate(currentDate.getDate() - 1);

  if (
      dateObject.toDateString() === currentDate.toDateString()
  ) {
    return dateObject.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } else if (
      dateObject.toDateString() === yesterday.toDateString()
  ) {
    return "Yesterday " + dateObject.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } else {
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1;
    const year = dateObject.getFullYear() % 100; // Get the last two digits of the year
    return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
  }
}


export function GetTaskStatusQueryParamByStatus(getAll: boolean, status: string, priorityFilter: string[], projectFilter: string[], pageSize: number = 0, pageIndex: number = 0): string {
  const params = new URLSearchParams();
  const queryString = [{"id":"task_status","value":[status]}]

  if(priorityFilter.length > 0) {
    queryString.push({"id":"task_priority","value":priorityFilter})
  }
  if(projectFilter.length > 0) {
    queryString.push({"id":"task_project_name","value":projectFilter})
  }

  if(pageSize) {
    params.set('pageSize', pageSize.toString());
    params.set('pageIndex', pageIndex.toString());
  }

  params.set('filters', JSON.stringify(queryString))

  if(getAll) {
    params.set('getAll', JSON.stringify(true));
  }

  return params.toString();
}