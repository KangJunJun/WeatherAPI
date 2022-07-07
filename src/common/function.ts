import dayjs from "dayjs";

export function checkTime(updatedAt?: Date): boolean {
  const now = dayjs();
  now.format("");

  return now.diff(updatedAt, "s") >= 60;
}

export function isNum(obj: string | number): boolean {
  return !isNaN(Number(obj));
}
