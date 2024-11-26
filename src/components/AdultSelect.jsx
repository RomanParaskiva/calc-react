import React from 'react'
import useStore from '../store/store';
import clsx from 'clsx';

const adultType = [
  '1 Взрослый',
  '2 Взрослых',
  '3 Взрослых'
];

const AdultSelect = ({ roomId }) => {
  const { updateRoomAdults } = useStore();
  const [currentText, setCurrentText] = React.useState(adultType[0]);
  const [isOpen, setIsOpen] = React.useState(false)
  const ref = React.useRef(null);
  const onChange = (item) => {
    setCurrentText(item);
    updateRoomAdults(roomId, Number(item.replace(/\D/g, '')));
    setIsOpen(false);
  }

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
        document.removeEventListener('click', handleClickOutside, true);
    };
}, []);

  return (
    <div className='custom_select' ref={ref}>
      <div className='select__first_row' onClick={() => setIsOpen(prev => !prev)}>
        <span>{currentText}</span>
        <svg className={clsx([isOpen && 'rotate'])} width="31" height="18" viewBox="0 0 31 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M29 2L15.5 15L2 2" stroke="#00B85D" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      <div className={clsx(['select__tooltip', isOpen && 'open'])}>
        {adultType.map(item => (
          <div key={item} onClick={() => onChange(item)}>{item}</div>
        ))}
      </div>
    </div>
  )
}

export default AdultSelect