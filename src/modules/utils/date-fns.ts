import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

export function dateFnsModifierTz(
  modifier: (input: Date | string | number) => Date | string | number,
  date: Date | string | number,
  timeZone: string,
) {
  return zonedTimeToUtc(modifier(utcToZonedTime(date, timeZone)), timeZone);
}
