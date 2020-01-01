const getTimeInt = function(uuidStr) {
  const uuidArr = uuidStr.split('-'),
    timeStr = [uuidArr[2].substring(1), uuidArr[1], uuidArr[0]].join('');
  return parseInt(timeStr, 16);
};

export const getDateFromTimeUuid = function(uuidStr) {
  const intTime = getTimeInt(uuidStr) - 122192928000000000,
    intMillisec = Math.floor(intTime / 10000);
  return new Date(intMillisec);
};
