import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home  from './pages/Home'
import Notes from './pages/Notes'
import ExampleLong from './pages/ExampleLong'
import Admin from './pages/Admin'
import MainLayout from './MainLayout'
import { useEffect } from 'react'
import { prod, employees } from './components/admin_components/Constants'
import { Login } from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  useEffect(() => {
    const prodData = localStorage.getItem('prod')
    const employeeData = localStorage.getItem('employees')
    if (!prodData) {
      localStorage.setItem('prod', JSON.stringify(prod))
    }
    if (!employeeData) {
      localStorage.setItem('employees', JSON.stringify(employees))
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path='/home' element={<Home />} />
          <Route path='/notes' element={<Notes />} />
          <Route path='/exampleLong' element={<ExampleLong />} />
          <Route path='/login' element={<Login />} />
        </Route>
        <Route
          path='/admin'
          element={
            <ProtectedRoute allowedRole='admin'>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
