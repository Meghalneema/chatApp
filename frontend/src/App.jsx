import { useState } from 'react'
import './App.css'
// import { Button} from '@chakra-ui/react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/homePages'
import ChatPage from './pages/chatPages'
function App() {
  
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/chats' element={<ChatPage />} />
      </Routes>
    </div>     
  )
}

export default App

