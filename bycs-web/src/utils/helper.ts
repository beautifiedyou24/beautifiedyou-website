import { DATE_FORMAT } from '@/constants/common';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export const createOptions = (values: string[]) => {
    const newOptions: any = [];
    values.forEach((category) => {
        newOptions.push({
            value: category,
            label: category,
        });
    });

    return newOptions;
}

export const generateRandomPercentage = () => {
    return 0.12;
};

const formatDate = (date: string | number | dayjs.Dayjs | Date | null | undefined, format: string = DATE_FORMAT.FORMAT_2) => {
    return dayjs(date).format(format);
};

export default formatDate;
