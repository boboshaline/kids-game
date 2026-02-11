import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { GameComponent } from './utils/game-component';
import HomePage from './utils/homepage';

function App() {
  useEffect(() => {

window.speechSynthesis.getVoices(); 
window.speechSynthesis.onvoiceschanged = () => {
  window.speechSynthesis.getVoices();
};},[]);

  return (
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/game/:levelId" element={<GameComponent/>}/>
    </Routes>
  )
}


export default App
