import React from 'react'
import Navbar from './Navbar/Navbar'
import Pomodoro from './Pomodoro/Pomodoro'
import { Route, Routes } from 'react-router-dom'

const Layout = () => {
    return (
        <>
            <Navbar />
            <div className="content">
                <Routes>
                    <Route exact path='/pomo' element={<Pomodoro />} />
                    {/* <Route path='/short' element={<ShortBreak />} />
                    <Route path='/long' element={<LongBreak />} /> */}
                </Routes>
            </div>
        </>
    )
}

export default Layout