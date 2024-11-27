import { useEffect, useState } from 'react'
import LeftHeader from './LeftHeader'
import axios from 'axios';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from 'swiper/modules';
import "swiper/css";
import 'swiper/css/navigation';
import ArrowNext from './shared/ArrowNext';
import ArrrowPrev from './shared/ArrrowPrev';
import clsx from 'clsx';
import useStore from '../store/store';

const monthNames = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const groupByMonth = (data) => {
  return data.reduce((acc, item) => {
    const key = `${item.y}-${item.m}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
};
const days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

const DateChoice = () => {
  const [dates, setDates] = useState([]);
  const [allowedLengths, setAllowedLengths] = useState([]);
  const { setArrivalDate, arrivalDate, rooms } = useStore();
  useEffect(() => {
    if (rooms.length > 0)
      setAllowedLengths(Array.from(
      new Set(
        rooms.flatMap(room =>
          room.people.map(person => person.program_length).filter(Boolean)
        )
      )
    ));
    axios.get(`https://kivach.ru/calc-new/api_new.php?method=program_dates&lengths`).then(({ data }) => setDates(() => groupByMonth(data.res)))
  },[rooms]);

  const handleClickOnDate = (item) => {
    setArrivalDate(item.date);
  }

  return (
    <>
      <LeftHeader isBtnDisabled={arrivalDate === null} />
      <div className='main__wrapper'>
        <div className='dates_swiper'>
          
          <Swiper 
            modules={[Navigation]}
            slidesPerView={window.innerWidth < 768 ? 1 : 3} 
            spaceBetween={0}
          >
            <ArrrowPrev/>
            {Object.entries(dates).map(([key, items]) => {
              const [year, month] = key.split("-");
              return (
                <SwiperSlide key={key}>
                  <div className='dates_swiper__slide'>
                    <h2>
                      {monthNames[month - 1]} {year}
                    </h2>
                      {items.filter(item => {
                          const lengthsArray = item.lengths.split(', ').map(length => length.trim());
                          return lengthsArray.some(length => allowedLengths.includes(length));
                      }).map((item) => (
                        <div onClick={() => handleClickOnDate(item)} key={item.date} className={clsx(['dates_swiper__row', item.date === arrivalDate && 'active'])}>
                          <div className='dates_swiper__number'>{item.d}</div> {days[new Date(item.date).getDay()]}
                        </div>
                      ))}
                  </div>
                </SwiperSlide>
              );
            })}
          <ArrowNext/>
          </Swiper>
        </div>
      </div>
    </>
  )
}

export default DateChoice