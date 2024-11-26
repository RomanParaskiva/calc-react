export const getTotalProgramPrice = rooms => {
  return rooms.reduce((total, room) => {
    const roomTotal = room.people.reduce((peopleTotal, person) => {
      return peopleTotal + (person.program_price || 0);
    }, 0);
    return total + roomTotal;
  }, 0);
};