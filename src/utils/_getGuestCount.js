export const _getGuestCount = rooms => {
  const totalPeopleCount = rooms.reduce((count, room) => count + room.people.length, 0);

  if (totalPeopleCount === 1) {
    return '1 гость';
  } else if (totalPeopleCount >= 2 && totalPeopleCount <= 4) {
    return `${totalPeopleCount} гостя`;
  } else if (totalPeopleCount >= 5) {
    return `${totalPeopleCount} гостей`;
  } else {
    return '';
  }
};