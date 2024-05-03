import React from 'react';
import { Link } from 'react-router-dom';
import './NavPage.scss';
import Quote from '../Quote/Quote';

const NavPage = () => {
    const currentHash = window.location.hash;
    const isHomePage = currentHash === '/#/';

    return (
        <div className='container'>
            <div className="header">
                <h2>ProductiVerse</h2>
            </div>
            <div className="nav">
                <div className="row">
                    <Link to='/task' className="navlink"><span>Manage your tasks</span></Link>
                    <Link to='/playlist' className="navlink"><span>Playlist</span></Link>
                </div>
                <div className="row">
                    <Link to='/pomodoro' className="navlink"><span>Pomodoro Timer</span></Link>
                    <Link to='/blocker' className="navlink"><span>Website Blocker</span></Link>
                </div>
                {isHomePage && (
                    <div className="row">
                        <Link to='/' className="navlink"><span>Home</span></Link>
                    </div>
                )}
                <Quote />
            </div>
            <div className="footer">

            </div>
        </div>
    );
};

export default NavPage;
