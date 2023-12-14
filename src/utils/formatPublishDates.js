import { DateTime } from 'luxon';

function formatPublishDates(start, end) {
  let startDate = start ? DateTime.fromISO(start).toFormat('MMMM dd, yyyy') : '?';
  let endDate = end ? DateTime.fromISO(end).toFormat('MMMM dd, yyyy') : '?';
  return `${startDate} to ${endDate}`;
}

export default formatPublishDates;
