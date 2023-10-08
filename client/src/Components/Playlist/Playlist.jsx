import React from 'react'
import './Playlist.scss'
import { Route, Routes } from 'react-router-dom'
import Login from './Login/Login'
import Player from './Player/Player'

const Playlist = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/player' element={<Player/>} />
      </Routes>
    </>
  )
}

export default Playlist