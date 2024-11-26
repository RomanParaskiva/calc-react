import { useEffect } from 'react';
import './App.css';
import PeopleCount from './components/PeopleCount'
import useStore from './store/store';
import RoomsChoice from './components/RoomsChoice';
import axios from 'axios';
import ProgramChoice from './components/ProgramChoice';
import DateChoice from './components/DateChoice';
import RightPanel from './components/RightPanel';
import FinalPage from './components/FinalPage';
import clsx from 'clsx';

const App = () => {
  const { step, setRoomVariants } = useStore((state) => state);



  useEffect(() => {
    const getRoomsData = async () => {
      const { data } = await axios.get('https://kivach.ru/calc-new/api_new.php?method=guests_rooms');
      const { guests, ...rest } = data.res;
      setRoomVariants(rest)
    }
    getRoomsData()
  }, [setRoomVariants])

  const _content = () => {
    switch (step) {
      case 1:
        return <PeopleCount />;

      case 2:
        return <RoomsChoice />;

      case 3:
        return <ProgramChoice />;

      case 4:
        return <DateChoice />;

      case 5: 
        return <FinalPage />;

      default:
        break;
    }
  }

  return (
    <div className="App">
      <div className='App__wrapper'>
        <div className="content__wrapper">
          <div className={clsx(["left", step === 5 && 'full-width'])}>
            {_content()}
          </div>
          <RightPanel />
        </div>

      </div>
    </div>
  );
}

export default App;
