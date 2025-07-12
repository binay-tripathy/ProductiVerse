import { Route, Routes, useLocation } from 'react-router-dom';
import './App.scss';
import NavPage from './Components/NavPage/NavPage';
import Tasks from './Components/Tasks/Tasks';
import Music from './Components/Music/Music';
import WebBlocker from './Components/WebBlocker/WebBlocker';
import Pomodoro from './Components/Pomodoro/Pomodoro';


function App() {
  const location = useLocation();
  const getFooterClass = () => {
    switch(location.pathname) {
      case '/':
        return 'footer footer-nav';
      case '/task':
        return 'footer footer-tasks';
      case '/music':
        return 'footer footer-music';
      case '/pomodoro':
        return 'footer footer-pomodoro';
      case '/blocker':
        return 'footer footer-blocker';
      default:
        return 'footer footer-nav';
    }
  };

  return (
    <>
      <Routes>
        <Route path='/' element={<NavPage />} />
        <Route path='/task' element={<Tasks />} />
        <Route path='/music' element={<Music />} />
        <Route path='/pomodoro/*' element={<Pomodoro />} />
        <Route path='/blocker' element={<WebBlocker />} />
      </Routes>
      <div className={getFooterClass()}>
        <p>© 2023 ProductiVerse - Boost Your Productivity</p>
      </div>
    </>
  );
}

export default App;