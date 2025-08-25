import {HashRouter, Routes, Route  } from "react-router-dom";
import HomePage from "./component/pages/homePage/HomePage";
import Login from "./component/pages/logIn y LogOut/Login";
import Register from "./component/pages/register/Register";
import Menu from "./component/pages/menu/Menu";
import Footer from "./component/pages/footer/Footer";
import './App.css'
import Layout from "./component/pages/layaut/Layout";
import Juguetedetalle from "./component/pages/juguetes/JugueteDetalle";


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
              <Route path="*" element={<p>Not Found</p>} />
            </Routes>
          </Layout>
        <Footer/>
      
      </HashRouter>
      
    
        
  )
}

export default App
