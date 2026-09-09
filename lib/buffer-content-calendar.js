import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonRaw = fs.readFileSync(path.join(__dirname, 'buffer-content-calendar.json'), 'utf8');
export const WEEKLY_BUFFER_SCHEDULE = JSON.parse(jsonRaw);

export function getDailyBufferSchedule(dayOfWeek = null) {
  const currentDay = (dayOfWeek !== null && dayOfWeek !== undefined) ? dayOfWeek : new Date().getDay();
  return WEEKLY_BUFFER_SCHEDULE[currentDay] || WEEKLY_BUFFER_SCHEDULE[1];
}