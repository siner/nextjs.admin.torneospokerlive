import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function padTo2Digits(num: number) {
  return num.toString().padStart(2, "0");
}

export function getTodayText() {
  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  return yyyy + "-" + mm + "-" + dd;
}

export function getDateText(datestring: string) {
  var date = new Date(datestring);
  var dd = String(date.getDate()).padStart(2, "0");
  var mm = String(date.getMonth() + 1).padStart(2, "0");
  var yyyy = date.getFullYear();
  return yyyy + "-" + mm + "-" + dd;
}

export function formatDate(date: Date) {
  let newdate = new Date(date);
  let ayer = new Date();
  ayer.setDate(ayer.getDate() - 1);
  let datestring = newdate.toLocaleDateString("es-ES", {
    month: "long",
    day: "numeric",
  });
  if (newdate < ayer)
    datestring = newdate.toLocaleDateString("es-ES", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  let hour =
    newdate.getHours() + ":" + String(newdate.getMinutes()).padStart(2, "0");
  return { datestring, hour };
}

export function formatFullDate(date: Date) {
  let newdate = new Date(date);
  return newdate.toLocaleDateString("es-ES", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function getMobileDate(date: string) {
  let newdate = new Date(date);
  return [
    padTo2Digits(newdate.getDate()),
    padTo2Digits(newdate.getMonth() + 1),
    newdate.getFullYear(),
  ].join("/");
}

export function getSimpleDate(date: string) {
  let newdate = new Date(date);
  return [
    padTo2Digits(newdate.getDate()),
    padTo2Digits(newdate.getMonth() + 1),
    padTo2Digits(newdate.getFullYear()),
  ].join("/");
}

export function getPagination(page: number, size: number) {
  const limit = size ? +size : 5;
  const from = page ? page * limit : 0;
  const to = page ? from + size - 1 : size - 1;
  return { from, to };
}

function getRGB(c: string) {
  return parseInt(c, 16);
}

function getsRGB(c: string) {
  return getRGB(c) / 255 <= 0.03928
    ? getRGB(c) / 255 / 12.92
    : Math.pow((getRGB(c) / 255 + 0.055) / 1.055, 2.4);
}

function getLuminance(hexColor: string) {
  return (
    0.2126 * getsRGB(hexColor.substr(1, 2)) +
    0.7152 * getsRGB(hexColor.substr(3, 2)) +
    0.0722 * getsRGB(hexColor.substr(-2))
  );
}

function getContrast(f: string, b: string) {
  const L1 = getLuminance(f);
  const L2 = getLuminance(b);
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}

export function getTextColor(bgColor: string) {
  const whiteContrast = getContrast(bgColor, "#ffffff");
  const blackContrast = getContrast(bgColor, "#000000");

  return whiteContrast > blackContrast ? "#ffffff" : "#000000";
}
