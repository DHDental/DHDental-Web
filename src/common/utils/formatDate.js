import dayjs from 'dayjs';

export function formatDateMonthYear(value) {
    return dayjs(value).format('DD-MM-YYYY');
}

export function formatYearMonthDate(value) {
    return dayjs(value).format('YYYY-MM-DD');
}

export function formatStringtoDate(value, firstFormat, endFormat) {
    return dayjs(value, firstFormat).format(endFormat);
}

