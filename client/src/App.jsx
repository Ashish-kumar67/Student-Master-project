
import {  Route, Routes , BrowserRouter } from 'react-router-dom'
import './App.css'
import StudentAdmission from './pages/StudentAdmission/StudentAdmission'
import Home from './pages/Home/Home'
import AddCoursePage from './pages/AddCourse/AddCoursePage'
import AddBatchPage from './pages/AddBatch/AddBatchPage'

function App() {


  return (
    <BrowserRouter>
  
    <Routes>
      <Route path='/StudentAdmissionForm' element={<StudentAdmission/>}/>
      <Route path='/AddCoursePage' element={<AddCoursePage/>}/>
      <Route path='/AddBatchPage' element={<AddBatchPage/>}/>
      <Route path='/' element={<Home/>}/>
      
    </Routes>
  </BrowserRouter>
  )
}

export default App
