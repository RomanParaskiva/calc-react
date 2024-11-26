import React from 'react'
import useStore from '../store/store';
import clsx from 'clsx';

const childType = [
 {guest_id: 7, name: 'Ребенок 0 - 4 года' },
 {guest_id: 5, name: 'Ребенок 5 - 10 лет' },
 {guest_id: 6, name: 'Ребенок 11 - 17 лет' },
];

const ChildSelect = ({ child, roomId, isLast }) => {
  const { addChildToRoom, removeChildFromRoom } = useStore();
  const [currentText, setCurrentText] = React.useState(child?.name || 'Добавить ребенка');
  const [isOpen, setIsOpen] = React.useState(false)
  const ref = React.useRef(null);

  const childId = child?.id || null;

  const onChange = ({guest_id, name}) => {
    child?.name && setCurrentText(name);
    addChildToRoom(roomId, childId, name, guest_id);
    setIsOpen(() => false)
  }

  const removeChild = () => {
    removeChildFromRoom(roomId, childId)
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
        {!isLast ? 
          <svg className={clsx([isOpen && 'rotate'])} width="31" height="18" viewBox="0 0 31 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M29 2L15.5 15L2 2" stroke="#00B85D" strokeWidth="3" strokeLinecap="round" />
          </svg> : 
          <span className='select__delete' onClick={removeChild}>удалить</span>
        }
      </div>

      <div className={clsx(['select__tooltip', isOpen && 'open'])}>
        {childType.map((item) => (
          <div key={item.name} onClick={() => onChange(item)}>{item.name}</div>
        ))}
      </div>
    </div>
  )
}

export default ChildSelect