import { useEffect, useState } from 'react'
import LeftHeader from './LeftHeader'
import useStore from '../store/store'
import axios from 'axios';
import clsx from 'clsx';
import ProgramList from './ProgramList';

const transformData = (data) => {
  return Object.entries(data).map(([_key, value]) => {
    const { types, ...rest } = value;

    const transformedTypes = types
      ? Object.values(types).map(({ id, name, lengths = [] }) => ({
          id,
          name,
          lengths,
        }))
      : [];

    return {
      ...rest,
      types: transformedTypes,
    };
  });
};

const ProgramChoice = () => {
  const { rooms, activeRoom, activeGuest, setActiveGuest } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);

  useEffect(() => {
    rooms?.length && setCurrentRoom(() => rooms.find(room => (room.id === activeRoom)));
  },[rooms, activeRoom]);

  useEffect(() => {
    const getPrograms = async () => {
      setIsLoading(() => true);
      const currentGuest = currentRoom?.people.find((item => item.id === activeGuest))
      try {
        const { data } = await axios.get(`https://kivach.ru/calc-new/api_new.php?method=new_programs&guest_id=${currentGuest?.guest_id}&room_id=${currentRoom?.apartment}`);
        setPrograms( transformData(data?.res) || []);
        setIsLoading(() => false);
      } catch (error) {
        setIsLoading(() => false);
      }
    }

    currentRoom !== null &&  getPrograms();
  }, [activeGuest, currentRoom?.apartment, currentRoom?.people]);
  
  return (
    <>
      <LeftHeader backAction={null} nextAction={null} isBtnDisabled={false} />
      <div className='main__wrapper'>
        <div className='tab__header'>
          {currentRoom !== null && currentRoom?.people.map(
            (item, idx) => (
              <span key={item.name + idx} className={clsx([idx === activeGuest && 'active'])} onClick={() => {}}>
                {item.name}
              </span>
            ))}
        </div>
        {isLoading ? 
          <div>
            Загрузка программ
          </div> :  
          <ProgramList programs={programs} />
        }
      </div>
    </>
  )
}

export default ProgramChoice