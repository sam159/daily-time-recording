import {convertTime, timeToMins} from "./time.js";
import {convertDuration} from "./duration.js";

export default function calculateRemaining(data) {
    const startNormalised = timeToMins(convertTime(data.startTime));
    const target = convertDuration(data.target);
    const breakLength = convertDuration(data.break);
    const recorded = convertDuration(data.recorded);

    const today = new Date();
    let now = today.getHours() * 60 + today.getMinutes();
    if (data.breakTaken) {
        now -= breakLength;
    }

    let remaining = now - startNormalised;

    if (remaining > target) {
        remaining = target;
    }

    remaining -= recorded;

    return remaining;
}