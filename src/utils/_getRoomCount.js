export const _getRoomCount = rooms => {
  const count = rooms.length;

  if (count === 1) {
    return '1 номер';
  } else if (count >= 2 && count <= 4) {
    return `${count} номера`;
  } else if (count >= 5) {
    return `${count} номеров`;
  } else {
    return '';
  }
};