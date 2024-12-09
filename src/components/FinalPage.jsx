import { useRef, useState } from 'react'
import useStore from '../store/store';
import Button from './shared/Button';
import axios from 'axios';
import { _getGuestCount } from '../utils/_getGuestCount';
import { _getRoomCount } from '../utils/_getRoomCount';
import { getTotalProgramPrice } from '../utils/getTotalProgramPrice';

const FinalPage = () => {
  const { rooms, arrivalDate, decreaseStep } = useStore();
  const [showForCalls, setShowForCalls] = useState(false);
  const [formError, setFormError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(null)
  const leftContentRef = useRef(null);
  const detailsRef = useRef(null);

  const addDaysAndFormat = (dateStr, daysNum) => {
    let offset = 1;
    if (dateStr.startsWith('2025-01-03')) offset = 2;
    const date = new Date(dateStr);
    date.setDate(date.getDate() + +daysNum - offset);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };

  const formatCurrency = (value) => {
    return value ? value.toLocaleString('ru-RU') : 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const summary = leftContentRef.current.innerHTML.replaceAll('&nbsp;', ' ');
    const details = detailsRef.current.innerHTML.replaceAll('&nbsp;', ' ');
    let t = '<tr><td>' + summary + '</td><td>' + details + '</td></tr>';
    formData.append('table', t);
    axios.post('https://kivach.ru/calc-new/new_calc_send.php', formData).then(({data}) => setIsSuccess(data)).catch((error) => {
      setFormError(error.response.data)
      setTimeout(() => {
        setFormError(null)
      },5000)
  });
  };



  return (
    <div className='main__wrapper'>
      <div className="final__header" ref={detailsRef}>
        <h3>Дата заезда: {arrivalDate.split('-').reverse().join('.')}, {_getRoomCount(rooms)}, {_getGuestCount(rooms)}</h3>
        {getTotalProgramPrice(rooms) > 0 ? 
          <h3>Стоимость: <span>{formatCurrency(getTotalProgramPrice(rooms))}</span> ₽</h3> : 
          <h3>Ведется расчет стоимости</h3>}
        <div className="divider"></div>
      </div>
      {isSuccess === null ? <div className='final__content--wrapper'>
        <div className='final__content--left' ref={leftContentRef}>
          {rooms.map(room => (
            <div key={room.id + '-room'} className='final__info--room'>
              <h3>Номер {room.id + 1} - {room.apartmentName}</h3>
              {room.people.map(ppl => (
                <div key={ppl.id + 'people'} className='final__info--people'>
                  <div className='final__info--people-type'>{ppl.type === 'child' ? `Ребенок ${ppl.id + 1} (${ppl.name})` : ppl.name.split(' ').reverse().join(' ')}</div>
                  <div>Программа:<br /> {ppl.program.name} - {ppl.program_type.name.toLowerCase()} {ppl.program_length} дней</div>
                  <div>Дата выезда - {addDaysAndFormat(arrivalDate, ppl.program_length)}</div>
                  <div className='final__info--people-price'>Стоимость: {ppl.program_price > 0 ? 
                    <span>{formatCurrency(ppl.program_price)}  ₽</span> :
                    <span>Уточните стоимость у менеджера</span>}
                    </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className='final__content--right'>
          <div className='error__wrapper' dangerouslySetInnerHTML={{__html: formError}} />
          <form onSubmit={handleSubmit}>
            <input id='uname' className='form-input' type="text" name='name' placeholder='Введите Ваше имя' />
            <input id="uphone" className='form-input' type="tel" name='phone' placeholder="Введите номер телефона" />
            <input id="uemail" className='form-input' type="email" name='email' placeholder="Введите email" />

            <span>Как с Вами связаться для подтверждения брони?</span>
            <fieldset>
              <label className='checkbox-label'>
                <input id="ucall" name='call' type="checkbox" onClick={({ target }) => { setShowForCalls(() => target.checked) }} />
                Позвонить по номеру телефона
              </label>
              {showForCalls && <div id="for-calls">
                <span>Выберите удобное время для звонка</span>
                <div className='inputs-grid'>
                  <select id="call-hour" name="call-hour">
                    <option value="9">9 часов</option>
                    <option value="10">10 часов</option>
                    <option value="11">11 часов</option>
                    <option value="12">12 часов</option>
                    <option value="13">13 часов</option>
                    <option value="14">14 часов</option>
                    <option value="15">15 часов</option>
                    <option value="16">16 часов</option>
                    <option value="17">17 часов</option>
                    <option value="18">18 часов</option>
                    <option value="19">19 часов</option>
                    <option value="20">20 часов</option>
                    <option value="21">21 час</option>
                    <option value="22">22 часа</option>
                  </select>
                  <select id="call-minutes" name="call-minutes">
                    <option value="0">0 минут</option>
                    <option value="10">10 минут</option>
                    <option value="20">20 минут</option>
                    <option value="30">30 минут</option>
                    <option value="40">40 минут</option>
                    <option value="50">50 минут</option>
                  </select>
                </div>
              </div>}
              <label className='checkbox-label'>
                <input id="whatsapp" type="checkbox" />
                Написать в WhatsApp
              </label>
              <label className='checkbox-label'>
                <input type="checkbox" />
                Написать на email
              </label>
            </fieldset>

            <div className='final__content--btns'>
              <Button text='Назад' type='small' action={() => decreaseStep()} />
              <Button buttonType='submit' color='green' text='Отправить заявку' type='wide' action={() => { }} />
            </div>

          </form>
        </div>
      </div> : <><div dangerouslySetInnerHTML={{ __html: isSuccess }} /> <Button text={'Заполнить заявку заново'} type={'wide'} color={'green'} action={() => window.location.reload()} /> </>}

      <p className="small__text" style={{fontSize: '12px', fontWeight: 600 }}>Оплата по ДМС . Мы работаем по системе добровольного медицинского страхования (ДМС) на санаторно-курортные и медицинские услуги. Среди наших партнеров: «Согаз», «Сбербанк страхование», «Росгосстрах», «Югория», «Согласие» и другие. В реестре наших партнеров более 25 крупных российских страховых компаний. Более подробную информацию о возможности оплаты услуг по полису ДМС можно узнать в Вашей страховой компании.</p>
    </div>
  )
}

export default FinalPage