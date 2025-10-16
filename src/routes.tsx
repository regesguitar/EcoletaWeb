import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CreatePoint from './pages/CreatePoint'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/create-point' element={<CreatePoint />} />
    </Routes>
  )
}

export default AppRoutes
