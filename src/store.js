import * as yup from "yup";

const DEFAULTS_KEY = 'defaults';
const RECORDED_KEY = 'recorded';

const defaultsSchema = yup.object({
    startTime: yup.string().required(),
    target: yup.string().required(),
}).required();

const recordedSchema = yup.object({
    recorded: yup.string().required(),
    updated: yup.number().required().nullable()
}).required();

function getJsonValue(key, defaultValue = {}) {
    const item = localStorage.getItem(key);
    if (item != null) {
        try {
            const data = JSON.parse(item);
            if (typeof data === 'object') {
                return data;
            }
        } catch (e) {
            localStorage.removeItem(key);
            return defaultValue;
        }
    }
    return defaultValue;
}

export function getStoredDefaults() {
    const value = getJsonValue(DEFAULTS_KEY);
    try {
        return defaultsSchema.validateSync(value);
    } catch (e) {
        return {};
    }
}

export function setStoredDefaults(data) {
    localStorage.setItem(DEFAULTS_KEY, JSON.stringify(data));
}

export function getStoredRecordedTime() {
    const info = getJsonValue(RECORDED_KEY, { recorded: '', updated: null });
    try {
        const data = recordedSchema.validateSync(info);
        if (data.updated != null) {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);

            if (data.updated < startOfDay.valueOf()) {
                return '';
            }
        }
        return data.recorded;
    } catch (e) {
        return '';
    }
}

export function setStoredRecordedTime(recorded) {
    localStorage.setItem(RECORDED_KEY, JSON.stringify({ recorded, updated: new Date().valueOf() }));
}
