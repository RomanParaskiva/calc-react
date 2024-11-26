import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Button from './shared/Button';
import useStore from '../store/store';

const successBtnText = () => {
  return (
    <>
      <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 10L7.40909 17L19 2" stroke="white" strokeWidth="3" strokeLinecap="round" />
      </svg> <span className='success_text'>Номер выбран</span>
    </>
  )
}

const ApartmentCard = ({ item }) => {
  const { rooms, updateRoom, activeRoom } = useStore((state) => state);
  const [buttonText, setButtonText] = useState('Выбрать');

  const currentRoom = rooms.find(room => room.id === activeRoom) || rooms[0];

  const handleClick = () => {
    updateRoom(currentRoom.id, { apartment: item.rid, apartmentName: item.name })
  }

  useEffect(() => {
    setButtonText(currentRoom.apartment === item.rid ? successBtnText : 'Выбрать')
  }, [currentRoom.apartment, item.rid, rooms])

  return (
    <div className='apartment__card'>
      <div className='apartment__slider'>
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          modules={[Pagination]}
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
        >
          {item.pictures.map((img, idx) => (
            <SwiperSlide key={img}>
              <img src={`https://${img}`} alt={`${item.name}-${idx}`} />
            </SwiperSlide>
          ))}

        </Swiper>
      </div>

      <div className='apartment__about'>
        <div dangerouslySetInnerHTML={{ __html: item.about }} />
        <Button color='green' type='wide' text={buttonText} action={handleClick} />
      </div>

    </div>
  )
}

export default ApartmentCard