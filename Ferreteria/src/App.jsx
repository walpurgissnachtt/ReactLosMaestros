import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home  from './pages/Home'
import Notes from './pages/Notes'
import ExampleLong from './pages/ExampleLong'
import Admin from './pages/Admin'
import MainLayout from './MainLayout'
import {Login} from "./pages/Login";
import ProtectedRoute from './components/ProtectedRoute';

export const App = () =>{
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path='/home' element={<Home />}/>
          <Route path='/notes' element={<Notes />}/>
          <Route path='/exampleLong' element={<ExampleLong />}/>
          <Route path='/login' element={<Login />}/>
        </Route>
        <Route>
          <Route path='/admin'
                 element={<ProtectedRoute allowedRole="admin">
                   <Admin />
                 </ProtectedRoute>}/>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
