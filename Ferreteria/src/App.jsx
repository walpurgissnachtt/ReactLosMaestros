import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home  from './pages/Home'
import Notes from './pages/Notes'
import ExampleLong from './pages/ExampleLong'
import MainLayout from './MainLayout'
import Dashboard from './components/admin_components/Dashboard'

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
            <Route path='/admin' element={<Dashboard />}/>
          </Route>
        </Routes>
      </BrowserRouter>
  )
}

export default App