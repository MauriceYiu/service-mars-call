export default (value) => {
    if (!value) return ''
    let date = new Date(value);
    let year = date.getFullYear();
    let month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1);
    let day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
    let seconds = date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds();
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}