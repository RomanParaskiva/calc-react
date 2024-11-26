import React from 'react'
import { useSwiper } from 'swiper/react'

const ArrrowPrev = () => {
  const swiper = useSwiper();
  return (
    <div className='dates_swiper--prev' onClick={() => swiper.slidePrev()}>
      <svg width="10" height="17" viewBox="0 0 10 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 15.5386L2 8.26934L9 1.00011" stroke="#00B85D" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  )
}

export default ArrrowPrev