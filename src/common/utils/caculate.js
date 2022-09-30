import dayjs from 'dayjs';

export function caculateAgeFromBirth(value) {
    const age = dayjs().year() - dayjs(value, "YYYY-MM-DD").year()
    return age
}