import { Route, Routes } from 'react-router-dom';
import './App.scss';
import NavPage from './Components/NavPage/NavPage';
import Tasks from './Components/Tasks/Tasks';
import Playlist from './Components/Playlist/Playlist';
import WebBlocker from './Components/WebBlocker/WebBlocker';
import Pomodoro from './Components/Pomodoro/Pomodoro';
// import Quote from './Components/Quote/Quote';


function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<NavPage />}/>
        <Route path='/task' element={<Tasks />} />
        <Route path='/playlist' element={<Playlist />} />
        <Route path='/pomodoro/*' element={<Pomodoro/>} />
        <Route path='/blocker' element={<WebBlocker />} />
        {/* <Route path='/quotes' element={<Quote />} /> */}
      </Routes>
      {/* <Quote /> */}
    </>
  );
}

export default App;
