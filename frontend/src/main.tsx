import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import HomePage from './pages/Home.tsx'
import './App.css'

createRoot(document.getElementById('root')!).render(
  <MotionConfig reducedMotion='never'>
    <BrowserRouter>
      <Routes>
        <Route path='/home' element={<HomePage/>}/>
        {/* <Route path='*' element={<div>hello</div>} /> */}
      </Routes>
      {/* <App /> */}
    </BrowserRouter>
  </MotionConfig>,
)
