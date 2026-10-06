import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home  from './pages/Home'
import Notes from './pages/Notes'
import ExampleLong from './pages/ExampleLong'

function App() {
  return (
    <BrowserRouter>
      <Link to="/home">
        Home
      </Link>
      <Link to="/notes">
        Notes!
      </Link>
      <Link to="/example">
        Example!
      </Link>
      <Routes>
        <Route path="/home" element={<Home />}/>
        <Route path='/notes' element={<Notes />}/>
        <Route path='/example' element={<ExampleLong />}/>
      </Routes>

    </BrowserRouter>
  )
}

export default App