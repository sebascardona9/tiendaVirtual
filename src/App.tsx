import {HashRouter, Routes, Route  } from "react-router-dom";
import HomePage from "./component/pages/homePage/HomePage";
import Login from "./component/pages/auth-pages/Login";
import Register from "./component/pages/register/Register";
import Menu from "./component/pages/menu/Menu";
import Footer from "./component/pages/footer/Footer";
import './App.css'
import Layout from "./component/pages/layout/Layout";
import Juguetedetalle from "./component/pages/juguetes/JugueteDetalle";
import AdminPanel from "./component/pages/admin/Admin";
import ProtecterRouter from "./component/auth/ProtecterRouter";


function App() {

  return (
    
    
      <HashRouter>
        

        <Menu/>
      
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage/>}/>
              <Route path="/juguetes" element={<HomePage/>}>
                <Route path=":slug" element={<Juguetedetalle/>} />
              </Route>
              <Route path="/Login" element={<Login/>} />
              <Route path="/Register" element={<Register/>} />
              <Route path="/Admin" element={
                <ProtecterRouter>
                  <AdminPanel/>
                </ProtecterRouter>
                } />
              <Route path="*" element={<p>Not Found</p>} />

            </Routes>
          </Layout>
        <Footer/>
      
      </HashRouter>
      
    
        
  )
}

export default App
