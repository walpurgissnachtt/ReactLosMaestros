
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home  from './pages/Home'
import Notes from './pages/Notes'
import ExampleLong from './pages/ExampleLong'
import Admin from './pages/Admin'
import MainLayout from './MainLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path='/home' element={<Home />}/>
          <Route path='/notes' element={<Notes />}/>
          <Route path='/exampleLong' element={<ExampleLong />}/>
        </Route>
        <Route>
          <Route path='/admin' element={<Admin/>}/>
        </Route>
      </Routes>

    </BrowserRouter>
  )
}

export default App