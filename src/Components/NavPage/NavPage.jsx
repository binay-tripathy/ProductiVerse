import { Link } from 'react-router-dom';
import './NavPage.scss';
import Quote from '../Quote/Quote';
import brainLogo from '/icons/android-chrome-512x512.png';

const NavPage = () => {
    return (
        <div className='container'>
            <div className="header">
                <div className="header-1">
                    <img
                        src={brainLogo}
                        alt="ProductiVerse Logo"
                        style={{ width: '60px', height: '60px' }}
                    />
                    <h2>ProductiVerse</h2>
                </div>
                <p>Your Ultimate Productivity Chrome Extension</p>
            </div>
            <div className="nav">
                <div className="row">
                    <Link to='/task' className="navlink"><span>Manage your tasks</span></Link>
                    <Link to='/music' className="navlink"><span>Ambient Sounds</span></Link>
                </div>
                <div className="row">
                    <Link to='/pomodoro' className="navlink"><span>Pomodoro Timer</span></Link>
                    <Link to='/blocker' className="navlink"><span>Website Blocker</span></Link>
                </div>
                <Quote />
            </div>
        </div>
    );
};

export default NavPage;
