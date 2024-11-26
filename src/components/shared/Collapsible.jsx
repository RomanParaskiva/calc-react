import clsx from 'clsx';
import React, { useState } from 'react'

const Collapsible = ({header, content}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className='collapsible'>
      <div className='collapsible__top' onClick={() => setIsOpen((prev) => !prev)}>
        <span>{header}</span>
        <svg className={clsx([isOpen && 'rotate'])} width="17" height="10" viewBox="0 0 17 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.5385 1L8.26922 8L0.99999 1" stroke="#00B85D" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <div className={clsx(['collapsible__content', isOpen && 'show'])} dangerouslySetInnerHTML={{ __html: content}} />
    </div>
  )
}

export default Collapsible