export const _getGuestString = (people) => {
  const { adultsCount, childsCount } = people.reduce(
    (counts, person) => {
      if (person.type === 'adult') counts.adultsCount++;
      if (person.type === 'child') counts.childsCount++;
      return counts;
    },
    { adultsCount: 0, childsCount: 0 }
  );

  const adults = `${adultsCount} ${adultsCount === 1 ? 'взрослый' : 'взрослых'}`;
  const childs =
    childsCount > 0
      ? `${childsCount} ${childsCount === 1 ? 'ребенок' : 'детей'}`
      : null;

  return `(${[adults, childs].filter(Boolean).join(', ')})`;
};

export const _getAllGuestString = (rooms) => {
  const { adultsCount, childsCount } = rooms.reduce(
    (counts, room) => {
      room.people.forEach((person) => {
        if (person.type === 'adult') counts.adultsCount++;
        if (person.type === 'child') counts.childsCount++;
      });
      return counts;
    },
    { adultsCount: 0, childsCount: 0 }
  );

  const adults = `${adultsCount} ${adultsCount === 1 ? 'взрослый' : 'взрослых'}`;
  const childs =
    childsCount > 0
      ? `${childsCount} ${childsCount === 1 ? 'ребенок' : 'детей'}`
      : null;

  return `${[adults, childs].filter(Boolean).join(', ')}`;
};