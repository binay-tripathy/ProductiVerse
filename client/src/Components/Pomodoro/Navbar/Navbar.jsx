import React from 'react'
import './Navbar.scss'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='nav-pomo'>
      <div className="nav-1">
        <Link to='' className="navlink1"><span>Pomodoro</span></Link>
      </div>
      <div className="nav-2">
        <Link to='short' className="navlink1"><span>Short Break</span></Link>
      </div>
      <div className="nav-3">
        <Link to='long' className="navlink1"><span>Long Break</span></Link>
      </div>
    </div>
  )
}

export default Navbar