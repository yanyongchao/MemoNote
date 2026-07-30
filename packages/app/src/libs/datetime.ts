import dayjs, { type Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

/**
 * 后台返回的时间字符串统一为 UTC（如 "2026-05-07 02:27:56"，无时区标识）。
 * 这里显式按 UTC 解析，再转成用户当前时区。
 */
export function parseServerTime(input?: string | null): Dayjs | null {
  if (!input) return null;
  const d = dayjs.utc(input);
  return d.isValid() ? d.local() : null;
}

/** 格式化后台时间，默认返回 { date: "YYYY/M/D", time: "HH:mm" } */
export function formatServerDateTime(input?: string | null) {
  const d = parseServerTime(input);
  if (!d) return { date: '', time: '' };
  return {
    date: d.format('YYYY/M/D'),
    time: d.format('HH:mm'),
  };
}

export { dayjs };
