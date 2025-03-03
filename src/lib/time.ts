export const timeFormat = (dateRaw: Date, format: string) => {
  const date = new Date(dateRaw);
  format = format.replace(/YYYY/, date.getFullYear().toString());
  format = format.replace(/MM/, (date.getMonth() + 1).toString());
  format = format.replace(/DD/, date.getDate().toString());
  format = format.replace(/hh/, date.getHours().toString());
  format = format.replace(/mm/, date.getMinutes().toString());
  format = format.replace(/ss/, date.getSeconds().toString());

  return format;
};
