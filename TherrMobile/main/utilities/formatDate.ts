const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default (unformattedDate) => {
    const date = new Date(unformattedDate);
    const year = date.getFullYear();
    const month = MONTHS[date.getMonth()];
    const day = date.getDate();
    let hours = date.getHours();
    hours = hours >= 12 ? hours - 11 : hours;
    const amPm = hours >= 12 ? 'PM' : 'AM';
    const minute = date.getMinutes().toString();

    return `${day}-${month}-${year} ${hours}:${minute.padStart(2, '0')} ${amPm}`;
};