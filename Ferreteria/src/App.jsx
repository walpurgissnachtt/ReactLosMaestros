import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Home  from './pages/Home'
import MainLayout from './MainLayout'
import Dashboard from './components/admin_components/Dashboard'
import { useEffect } from 'react'
import { prod } from './components/admin_components/Constants'
import { employees } from './components/admin_components/Constants'
function App() {
  //se inicia el mockup para los datos
  useEffect(() =>{
    const prod_data = localStorage.getItem("prod")
    const employee_data = localStorage.getItem("employees")
    if(!prod_data){
      localStorage.setItem("prod",JSON.stringify(prod))
    }
    if(!employee_data){
      localStorage.setItem("employees", JSON.stringify(employees))
    }
  },[])
  return (
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path='/home' element={<Home />}/>
          </Route>
          <Route>
            <Route path='/admin' element={<Dashboard />}/>
          </Route>
        </Routes>
      </BrowserRouter>
  )
}

export default App