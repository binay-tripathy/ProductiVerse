import React from 'react'
import './NavPage.scss'

const NavPage = () => {
    return (
        <div className='container'>
            <div className="header">
                <h2>ProductiVerse</h2>
            </div>
            <div className="nav">
                <div className="row">

                    <button className="navlink">
                        <a href="/task">Manage your tasks</a>
                    </button>
                    <button className="navlink">
                        <a href='/playlist'>Playlist</a>
                    </button>
                </div>
                <div className="row">

                    <button className="navlink">
                        <a href='/pomodoro'>Pomodoro Timer</a>
                    </button>
                    <button className="navlink">
                        <a href='blocker'>Website Blocker</a>
                    </button>
                </div>
                <div className="row">

                    <button className="navlink">
                        <a href='analytics'>Analytics</a>
                    </button>
                    <button className="navlink">
                        <a href='feedback'>Feedback and Support</a>
                    </button>
                </div>
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