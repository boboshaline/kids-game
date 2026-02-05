import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Game } from './utils/game'
import HomePage from './utils/homepage'

function App() {

  return (
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/game/:levelId" element={<Game/>}/>
    </Routes>
  )
}


export default App
