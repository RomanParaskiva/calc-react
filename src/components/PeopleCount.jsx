import React from 'react'
import useStore from '../store/store'
import Button from './shared/Button'
import AdultSelect from './AdultSelect'
import ChildSelect from './ChildSelect'
import DeleteIcon from './shared/DeleteIcon'
import LeftHeader from './LeftHeader'

const PeopleCount = () => {
  const { rooms, addRoom, removeRoom } = useStore((state) => state);

  const handleDeleteRoomVision = (roomId) => {
    return roomId === rooms.length - 1 && roomId > 0 ? 'flex' : 'none'
  }

  return (
    <>
      <LeftHeader backAction={null} nextAction={null} isBtnDisabled={false} />
      <div className='main__wrapper'>
        {rooms.map((room) => {
          return <div style={{ width: '100%' }} key={`room-${room.id}`}>
            <div className='main__header'>
              <h2>Номер {room.id + 1}</h2>
              <span style={{ display: handleDeleteRoomVision(room.id) }} className='delete_room' onClick={removeRoom}>
                Удалить номер<DeleteIcon />
              </span>
            </div>
            <div className='people_count'>
              <AdultSelect roomId={room.id} />
              {(room?.people?.filter(item => item.type === 'child') || []).map(
                (child, idx, arr) => (
                  <ChildSelect
                    key={`child-${room.id}-${child.id}`}
                    child={child}
                    roomId={room.id}
                    isLast={idx === arr.length - 1}
                  />))}
              {room.people.length < 4 && <ChildSelect key={`new-child-${room.id}`} child={null} roomId={room.id} />}
            </div>
          </div>
        })}

        <Button type='wide' color='green' text='Добавить номер' action={addRoom} />
      </div>
    </>
  )
}

export default PeopleCount