const MONTHS = {
    'januari': 'Jan',
    'februari': 'Feb',
    'maart': 'Mar',
    'april': 'Apr',
    'mei': 'May',
    'juni': 'Jun',
    'juli': 'Jul',
    'augustus': 'Aug',
    'september': 'Sep',
    'oktober': 'Oct',
    'november': 'Nov',
    'december': 'Dec'
};

const parseDateString = (str) => {
    const [d, m, y] = str.replace('Vanaf ', '').split(' ');
    const month = MONTHS[m];
    return `${month} ${d}, ${y}`;
};

export default (titles) => {
    return titles.sort((a, b) => Date.parse(parseDateString(a.release)) - Date.parse(parseDateString(b.release)));
};