import { Route, Routes } from 'react-router-dom';
import { GameComponent } from './utils/game-component';
import HomePage from './utils/homepage';

function App() {

  return (
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/game/:levelId" element={<GameComponent/>}/>
    </Routes>
  )
}


export default App
