import { create } from 'zustand'

const createMainSlice = (set) => ({
  step: 1,
  rooms: [{
    id: 0,
    people: [{
      id: 0,
      type: 'adult',
      name: '1 взрослый',
      guest_id: 1,
      program: { id: null, name: null },
      program_type: { id: null, name: null },
      program_length: null,
      program_price: null,
    }],
    apartment: null,
    apartmentName: null,
    price: 0,
  }],
  roomVariants: null,
  arrivalDate: null,
  increaseStep: () => set((state) => ({ step: state.step + 1 })),
  decreaseStep: () => set((state) => ({ step: state.step - 1 })),
  updatePrice: (roomId, guestId, program_price) => set((state) => {
    const stateRooms = [...state.rooms];
    const room = stateRooms.find(room => room.id === roomId);
    room.people[guestId].program_price = program_price;
    
    return { rooms: [...stateRooms] }
  }),
  updateRoom: (roomId, updates) => set((state) => {
    const updatedRooms = state.rooms.map(room =>
      room.id === roomId ? { ...room, ...updates } : room
    );
    return { rooms: updatedRooms };
  }),
  setArrivalDate: (date) => set((state) => ({ arrivalDate: date })),
  addRoom: () => set((state) => ({
    rooms: [...state.rooms, {
      id: state.rooms.length,
      people: [{
        id: 0,
        type: 'adult',
        name: `1 взрослый`,
        guest_id: 1,
        program: { id: null, name: null },
        program_type: { id: null, name: null },
        program_length: null,
      }],
      apartment: null,
      apartmentName: null,
      price: 0,
    }]
  })),
  setRoomVariants: (data) => set((state) => state.roomVariants = { ...data }),
  updateRoomApartment: (roomId, appartmentId) => set((state) => {
    const stateRooms = [...state.rooms];
    const room = stateRooms.find(room => room.id === roomId);
    room.apartment = appartmentId;
    return { rooms: [...stateRooms] }
  }),
  updateRoomAdults: (roomId, adultCount) => set((state) => {
    const stateRooms = [...state.rooms];
    const room = stateRooms.find(room => room.id === roomId);
    room.people = Array.from({ length: adultCount }, (_, id) => ({
      id,
      type: 'adult',
      guest_id: 1,
      name: `${id + 1} взрослый`,
      program: { id: null, name: null },
      program_type: { id: null, name: null },
      program_length: null,
    }));

    return { rooms: [...stateRooms] }
  }),
  addChildToRoom: (roomId, childId, childName, guest_id) => set((state) => {
    const stateRooms = [...state.rooms];
    const room = stateRooms.find(room => room.id === roomId);
    if (childId === null) {
      room.people.push({
        id: room.people.length,
        type: 'child',
        name: childName,
        guest_id,
        program: { id: null, name: null },
        program_type: { id: null, name: null },
        program_length: null,
      })

      room.people = room.people.map((item, idx) => ({ ...item, id: idx }))
    } else {
      room.people.find((item) => item.id === childId).name = childName;
      room.people.find((item) => item.id === childId).guest_id = guest_id;
    }
    return { rooms: [...stateRooms] }
  }),
  removeChildFromRoom: (roomId, childId) => set((state) => {
    const stateRooms = [...state.rooms];
    const room = stateRooms.find(room => room.id === roomId);
    room.people = room.people.filter((item) => item.id !== childId).map((item, idx) => ({ ...item, id: idx }));
    return { rooms: [...stateRooms] }
  }),
  removeRoom: () => set((state) => {
    return { rooms: [...state.rooms.slice(0, -1)] }
  }),
  updateGuest: (roomId, id, programData) => set((state) => {
    const stateRooms = [...state.rooms];
    const room = stateRooms.find(room => room.id === roomId);
    room.people[id] = { ...room.people[id], ...programData }
    return { rooms: [...stateRooms] }
  }),
});

const createActiveRoomSlice = (set) => ({
  activeRoom: null,
  activeGuest: null,
  setActiveRoom: (roomId) => set(() => ({ activeRoom: roomId })),
  setActiveGuest: (guestId) => set(() => ({ activeGuest: guestId })),
});

const useStore = create((...a) => ({
  ...createMainSlice(...a),
  ...createActiveRoomSlice(...a),
}))

export default useStore;