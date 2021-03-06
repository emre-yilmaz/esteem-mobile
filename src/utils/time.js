import moment from 'moment';

const TODAY = moment().startOf('day');
const YESTERDAY = moment()
  .subtract(1, 'days')
  .startOf('day');
const THIS_WEEK = moment()
  .subtract(7, 'days')
  .startOf('day');
const THIS_MONTH = moment()
  .subtract(1, 'M')
  .startOf('day');

export const getTimeFromNow = (value) => {
  if (!value) return null;

  return moment
    .utc(value)
    .local()
    .fromNow();
};

export const getFormatedCreatedDate = (value) => {
  if (!value) return null;

  return moment(value).format('DD MMM, YYYY');
};

export const isBefore = (a, b) => moment(a).isBefore(b);

export const isToday = value => moment(value).isSame(TODAY, 'd');

export const isYesterday = value => moment(value).isSame(YESTERDAY, 'd');

export const isThisWeek = value => moment(value).isSameOrAfter(THIS_WEEK);

export const isThisMonth = value => moment(value).isSameOrAfter(THIS_MONTH);
