export const timeRe = /^(?:[012]?\d:\d{2}|1?\d(?::\d{2})?(?:am|pm))$/i

export function convertTime(value) {
    if (/^[012]?\d:\d{2}$/.test(value)) {
        return value;
    }
    const twelveHour = /^(?<hour>[01]?\d)(?::(?<min>\d{2}))?(?<ampm>am|pm)$/i.exec(value);
    if (twelveHour != null) {
        let hour = parseInt(twelveHour.groups['hour'], 10);
        const minute = parseInt(twelveHour.groups['min'] ?? '0', 10);
        const ampm = twelveHour.groups['ampm'].toLowerCase();
        if (hour === 12) {
            if (ampm === 'am') {
                hour = 0;
            }
        } else if (ampm === 'pm') {
            if (hour < 12) {
                hour += 12;
            }
        }
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }

    return value;
}

export function timeToMins(value) {
    const match = /^(?<hour>[012]?\d):(?<min>\d{2})$/.exec(value);
    if (match) {
        const hour = parseInt(match.groups.hour, 10);
        const min = parseInt(match.groups.min, 10);
        return (hour * 60) + min;
    }
    return 0;
}

export function minsToTime(totalMinutes) {
    let prefix = totalMinutes < 0 ? '- ' : '';
    let absMinutes = Math.abs(totalMinutes);
    let hours = Math.floor(absMinutes / 60);
    let minutes = absMinutes % 60;
    if (minutes > 0) {
        return `${prefix}${hours}h ${minutes}m`;
    }
    if (hours > 0) {
        return `${hours}h`;
    }
    return '0m';
}
