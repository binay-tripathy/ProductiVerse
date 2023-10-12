import React from 'react'
import Navbar from './Navbar/Navbar'
import Pomodoro from './Pomodoro/Pomodoro'
import { Route, Routes } from 'react-router-dom'
import ShortBreak from './ShortBreak/ShortBreak'
import LongBreak from './LongBreak/LongBreak'

const Layout = () => {
    return (
        <>
            <Navbar />
            {/* <div className="content"> */}
                <Routes>
                    <Route index element={<Pomodoro />} />
                    <Route path='/pomodoro/short' element={<ShortBreak />} />
                    <Route path='/pomodoro/long' element={<LongBreak />} />
                </Routes>
            {/* </div> */}
        </>
    )
}

export default Layout