import React from 'react'
import './NavPage.scss'
import { Link } from 'react-router-dom'

const NavPage = () => {
    return (
        <div className='container'>
            <div className="header">
                <h2>ProductiVerse</h2>
            </div>
            <div className="nav">
                <div className="row">
                    <Link to='/task'className="navlink"><span>Manage your tasks</span></Link>
                    <Link to='/playlist'className="navlink"><span>Playlist</span></Link>
                </div>
                <div className="row">
                <Link to='/pomodoro'className="navlink"><span>Pomodoro Timer</span></Link>
                <Link to='/blocker'className="navlink"><span>Website Blocker</span></Link>
                </div>
                {/* <div className="row">
                <Link to='/analytics'className="navlink"><span>Analytics</span></Link>
                <Link to='/feedback'className="navlink"><span>Feedback and Support</span></Link>
                </div> */}
                <div className="row2">
                    <button className="navlink2">
                        <span>Quotes</span>
                    </button>
                </div>
            </div>
            <div className="footer">

            </div>
        </div>
    )
}

export default NavPage