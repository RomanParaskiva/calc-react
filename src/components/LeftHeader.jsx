import React from 'react';
import useStore from '../store/store';
import Button from './shared/Button';
import { _getGuestString } from '../utils/_getGuestString';
import axios from 'axios';

const getTitle = (step, currentRoomId) => {
  switch (step) {
    case 1:
      return 'Укажите количество гостей';

    case 2:
      return `Выберите номер ${currentRoomId}`;

    case 3:
      return `Выберите программу`;

    case 4:
      return `Выберите желаемую дату заезда*`;

    default:
      break;
  }
}

const handleStepTwo = (rooms, setActiveRoom, setActiveGuest, currentRoom, increaseStep, decreaseStep, setIsBtnDisabled, reverse) => {
  if (reverse) {
    const prevRoomIndex = currentRoom.id - 1;

    if (prevRoomIndex >= 0) {
      setActiveRoom(rooms[prevRoomIndex].id);
    } else {
      decreaseStep();
      setActiveRoom(rooms[rooms.length - 1].id);
    }
  } else {
    const nextRoomIndex = currentRoom.id + 1;

    if (nextRoomIndex < rooms.length) {
      setActiveRoom(rooms[nextRoomIndex].id);
    } else {
      increaseStep();
      setActiveRoom(rooms[0].id);
      setActiveGuest(0);
    }
    setIsBtnDisabled(true);
  }
};

const handleStepThree = (rooms, setActiveRoom, currentRoom, activeGuest = 0, setActiveGuest, increaseStep, decreaseStep, setIsBtnDisabled, reverse) => {
  if (reverse) {
    const prevGuest = activeGuest - 1;

    if (prevGuest >= 0) {
      setActiveGuest(prevGuest);
    } else {
      const prevRoomIndex = currentRoom.id - 1;

      if (prevRoomIndex >= 0) {
        setActiveRoom(rooms[prevRoomIndex].id);
      } else {
        decreaseStep();
        setActiveRoom(rooms[rooms.length - 1].id);
      }
    }
  } else {
    const nextGuest = activeGuest + 1;

    if (nextGuest < currentRoom.people.length) {
      setActiveGuest(nextGuest);
      setIsBtnDisabled(true);
    } else {
      const nextRoomIndex = currentRoom.id + 1;
      if (nextRoomIndex < rooms.length) {
        setActiveGuest(0);
        setActiveRoom(rooms[nextRoomIndex].id);
        setIsBtnDisabled(true);
      } else { 
        setActiveRoom(rooms[0].id);
        setIsBtnDisabled(true);
        increaseStep();
      }
    }
  }
};

const handleStepFour = (rooms, arrivalDate, setArrivalDate, updatePrice, increaseStep, decreaseStep, reverse) => {
  if (reverse) {
    setArrivalDate(null);
    decreaseStep();
  } else {
    const getProgramPrice = async (
      program_id, program_type, program_length, guest_id, room_id, arrivalDate) => {
      const { data: { res } } = await axios.get(`https://kivach.ru/calc-new/api_new.php?method=prices_new&program_id=${program_id}&type_id=${program_type}&length=${program_length}&guest_id=${guest_id}&room_id=${room_id}&date=${arrivalDate}`);
      return res.sum;
    }

    rooms.forEach(room => {
      room.people.forEach(ppl => {
        getProgramPrice(ppl.program.id, ppl.program_type.id, ppl.program_length, ppl.guest_id, room.apartment, arrivalDate).then(data => updatePrice(room.id, ppl.id, +data))
      })
    })
    increaseStep();
  }
}

const LeftHeader = ({ isBtnDisabled = false, setIsBtnDisabled = () => { } }) => {
  const { step, increaseStep, decreaseStep, rooms, setActiveRoom, setArrivalDate, activeRoom, activeGuest, setActiveGuest, arrivalDate, updatePrice } = useStore((state) => state);

  const scrollToTop = () => {
    setTimeout(() => {
      window.scrollTo({top: document.querySelector('.left__header')?.getBoundingClientRect()?.bottom || 0, behavior: 'smooth'})
    },0)
  }

  const backIsVisible = step > 1;

  const nextIsVisible = step < 5;

  const currentRoom = rooms.find(item => item.id === activeRoom) || rooms[0];

  const handleNextStep = () => {
    scrollToTop();
    switch (step) {
      case 1:
        increaseStep();
        setActiveRoom(rooms[0].id);
        break;

      case 2:
        handleStepTwo(rooms, setActiveRoom, setActiveGuest, currentRoom, increaseStep, decreaseStep, setIsBtnDisabled, false);
        break;

      case 3:
        handleStepTwo(rooms, setActiveRoom, setActiveGuest, currentRoom, increaseStep, decreaseStep, setIsBtnDisabled, false);
        break;

      case 4:
        handleStepFour(rooms, arrivalDate, setArrivalDate, updatePrice, increaseStep, decreaseStep, false);
        break;

      default:
        break;
    }
  }

  const handlePrevStep = () => {
    scrollToTop();
    switch (step) {
      case 1:
        break;

      case 2:
        handleStepTwo(rooms, setActiveRoom, setActiveGuest, currentRoom, increaseStep, decreaseStep, setIsBtnDisabled, true);
        break;

      case 3:
        handleStepThree(rooms, setActiveRoom, currentRoom, activeGuest, setActiveGuest, increaseStep, decreaseStep, setIsBtnDisabled, true);
        break;

      case 4:
        handleStepFour(rooms, arrivalDate, setArrivalDate, updatePrice, increaseStep, decreaseStep, true);
        break;

      default:
        break;
    }
  }

  const _getRoomName = (room) => {
    return `(${room.apartmentName})`
  }

  const stepSubTitle = (currentRoom, step) => {
    switch (step) {
      case 1:
        break;

      case 2:
        return _getGuestString(currentRoom.people);

      case 3:
        return _getRoomName(currentRoom);

      case 4:
        return <span className='subtitle__small'>* Наличие свободных номеров проверяет отдел<br />бронирования после получения заявки.'</span>;

      default:
        return '';
    }
  };

  const renderBtn = () => {
    return (
      <div className='buttons__wrapper'>
        {backIsVisible && <Button type='small' color='gray' text='Назад' action={handlePrevStep} />}
        {nextIsVisible && <Button type='small' color='green' text='Далее' action={handleNextStep} isBtnDisabled={isBtnDisabled} />}
      </div>
    )
  }
  return (
    <div className='left__header'>
      <div className='flex flex-col'>
        <span>Шаг {step}.</span>
        <span>{getTitle(step, currentRoom.id + 1)}</span>
        <span>{stepSubTitle(currentRoom, step)}</span>
      </div>

      {renderBtn()}
    </div>
  )
}

export default LeftHeader