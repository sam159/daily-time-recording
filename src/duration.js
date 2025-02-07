/**
 * allows for minutes, hh:mm, 1h 1m formats
 * @type {RegExp}
 */
export const durationRe = /(^\d+|^([012]?\d:\d{2})|((?:^|\s)\d+(?:\.\d+)?[hm])+)$/i;

export function convertDuration(value) {
    if (!value) {
        return value;
    }

    if (/^\d+$/.test(value)) {
        return parseInt(value, 10);
    }

    const timeMatch = /^(?<hour>[012]?\d):(?<min>\d{2}$)/.exec(value);
    if (timeMatch != null) {
        const hours = parseInt(timeMatch.groups.hour, 10);
        const mins = parseInt(timeMatch.groups.min, 10);
        return (hours * 60) + mins;
    }

    if (/((?:^|\s)\d+(?:\.\d+)?[hm])+$/i.test(value)) {
        let mins = 0;
        const parts = value.split(/\s+/);
        for (const part of parts) {
            const {groups: {amount, spec}} = /^(?<amount>\d+(?:\.\d+)?)(?<spec>[hm])$/i.exec(part);
            switch (spec.toLowerCase()) {
                case 'h':
                    mins += parseFloat(amount) * 60;
                    break;
                case 'm':
                    mins += parseFloat(amount);
                    break;
            }
        }
        return mins;
    }

    return 0;
}