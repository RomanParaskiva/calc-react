import React from 'react'
import { useSwiper } from 'swiper/react';

const ArrowNext = () => {
  const swiper = useSwiper();
  return (
    <div className='dates_swiper--next' onClick={() => swiper.slideNext()}>
      <svg width="10" height="17" viewBox="0 0 10 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L8 8.26923L0.999999 15.5385" stroke="#00B85D" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  )
}

export default ArrowNext