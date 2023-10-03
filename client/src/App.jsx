import { Route, Routes } from 'react-router-dom';
import './App.scss';
import NavPage from './Components/NavPage/NavPage';
import Tasks from './Components/Tasks/Tasks';
import Playlist from './Components/Playlist/Playlist';


function App() {
  return (
    <>
      <NavPage />
      <Routes>
        <Route path='/task' element={<Tasks />} />
        <Route path='/playlist' element={<Playlist />} />
      </Routes>
    </>
  );
}

export default App;
