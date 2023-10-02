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

                    <div className="navlink">
                        <span>Manage your tasks</span>
                    </div>
                    <div className="navlink">
                        <span>Playlist</span>
                    </div>
                </div>
                <div className="row">

                    <div className="navlink">
                        <span>Pomodoro Timer</span>
                    </div>
                    <div className="navlink">
                        <span>Website Blocker</span>
                    </div>
                </div>
                <div className="row">

                    <div className="navlink">
                        <span>Analytics</span>
                    </div>
                    <div className="navlink">
                        <span>Feedback and Support</span>
                    </div>
                </div>
                <div className="row2">
                    <div className="navlink2">
                        <span>Quotes</span>
                    </div>
                </div>
            </div>
            <div className="footer">

            </div>
        </div>
    )
}

export default NavPage