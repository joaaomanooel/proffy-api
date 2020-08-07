/**
 * Convert hour string to minutes
 * @param time string > HH:mm
 * @returns Return the converted time to minutes as number
 * @example convertHourToMinites('08:30'); // 510
 */
export const convertHourToMinites = (time: string) => {
  const [hour = 0, minutes = 0] = time.split(':').map(Number);
  return (hour * 60) + minutes;
};
