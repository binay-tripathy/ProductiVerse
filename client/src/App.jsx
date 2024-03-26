import { Route, Routes } from 'react-router-dom';
import './App.scss';
import NavPage from './Components/NavPage/NavPage';
import Tasks from './Components/Tasks/Tasks';
import Playlist from './Components/Playlist/Playlist';
import WebBlocker from './Components/WebBlocker/WebBlocker';
import Pomodoro from './Components/Pomodoro/Pomodoro';


function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<NavPage />}/>
        <Route path='/task' element={<Tasks />} />
        <Route path='/playlist' element={<Playlist />} />
        <Route path='/pomodoro/*' element={<Pomodoro/>} />
        <Route path='/blocker' element={<WebBlocker />} />
      </Routes>
    </>
  );
}

export default App;
