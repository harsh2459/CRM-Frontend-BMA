import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminLogin from './pages/AdminLogin'
import AdminSignup from './pages/AdminSignup'

export default function Routing() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<AdminLogin />} />
                <Route path="/signup" element={<AdminSignup />} />
            </Routes>
        </div>
    )
}
