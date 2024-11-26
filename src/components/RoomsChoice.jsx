import { useCallback, useEffect, useState } from 'react'
import useStore from '../store/store'
import LeftHeader from './LeftHeader';
import ApartmentCard from './ApartmentCard';

const RoomsChoice = () => {
  const { rooms, roomVariants, activeRoom } = useStore();
  const [isBtnDisabled, setIsBtnDisabled] = useState(true);
  const [currentVariants, setCurrentVariants] = useState([]);
  const currentRoom = rooms.find(room => room.id === activeRoom);

  const getVariants = useCallback(() => {
    const currentRoom = rooms.find(room => room.id === activeRoom);
    const peopleCount = currentRoom?.people?.length || 0;
    setCurrentVariants(() => roomVariants[peopleCount])
  }, [activeRoom, roomVariants, rooms]);

  useEffect(() => {
    getVariants()
  }, [getVariants, roomVariants]);

  useEffect(() => {
    const currentRoom = rooms.find(room => room.id === activeRoom);
    if(currentRoom.apartment !== null) setIsBtnDisabled(() => false);
  },[activeRoom, currentRoom, rooms]);

  return (
    <>
      <LeftHeader isBtnDisabled={isBtnDisabled} setIsBtnDisabled={setIsBtnDisabled}/>
      <div className='main__wrapper'>
        {currentVariants.map((item) => (<ApartmentCard key={item.rid} item={item} />))}
      </div>
    </>
  )
}

export default RoomsChoice