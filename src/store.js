import * as yup from "yup";

const DEFAULTS_KEY = 'defaults';
const RECORDED_KEY = 'recorded';

const defaultsSchema = yup.object({
    startTime: yup.string().required(),
    target: yup.string().required(),
    break: yup.string().required(),
}).required();

const recordedSchema = yup.object({
    recorded: yup.string().required(),
    breakTaken: yup.boolean().required(),
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
    try {
        localStorage.setItem(DEFAULTS_KEY, JSON.stringify(defaultsSchema.cast(data, {stripUnknown: true})));
    } catch (e) {
        console.error(`Error setting stored defaults: ${e.message}`);
    }
}

export function getStoredRecordedTime() {
    const info = getJsonValue(RECORDED_KEY, { recorded: '', breakTaken: false, updated: null });
    try {
        const data = recordedSchema.validateSync(info);
        if (data.updated != null) {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);

            if (data.updated < startOfDay.valueOf()) {
                return { recorded: '0', breakTaken: false };
            }
        }
        return {
            recorded: data.recorded,
            breakTaken: data.breakTaken,
        };
    } catch (e) {
        return { recorded: '0', breakTaken: false };
    }
}

export function setStoredRecordedTime(recorded, breakTaken) {
    localStorage.setItem(RECORDED_KEY, JSON.stringify({ recorded, breakTaken, updated: new Date().valueOf() }));
}
