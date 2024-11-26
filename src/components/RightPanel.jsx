import React, { useEffect, useState } from 'react'
import useStore from '../store/store'
import Collapsible from './shared/Collapsible';
import { _getGuestCount } from '../utils/_getGuestCount';
import { _getAllGuestString, _getGuestString } from '../utils/_getGuestString';

const RightPanel = () => {
  const { step, rooms } = useStore();
  const [programs, setPrograms] = useState([]);

  const getPeopleProgramms = (rooms) => {
    const result = [];
    for (const room of rooms) {
      for (const ppl of room.people) {
        if (ppl.program.name !== null) {
          result.push(`${ppl.program.name} - ${ppl.program_type.name} ${ppl.program_length} дней<br/> (${ppl.name})`)
        }
      }
    }
    return result
  }

  useEffect(() => {
    setPrograms(() => getPeopleProgramms(rooms))
  },[rooms])

  if (step < 2 || step > 4) return null;

  return (
    <div className='right_panel'>
      <h3>ДЕТАЛИ БРОНИРОВАНИЯ</h3>

      <Collapsible header={_getGuestCount(rooms)} content={_getAllGuestString(rooms)} />

      {
        rooms.map((room) => {
          return room.apartment !== null ?
            <Collapsible key={room.id + '-room'} header={`Номер ${room.id + 1}`} content={`${room.apartmentName}<br/>${_getGuestString(room.people)}`} /> : room.apartment
        })
      }
      {programs?.length > 0 && <Collapsible header={'Программа'} content={programs.join('<br/>')} />}
    </div>
  )
}

export default RightPanel