import { HashRouter, Routes, Route } from "react-router-dom"
import { CartProvider } from "./context/CartContext"
import HomePage            from "./component/pages/homePage/HomePage"
import Login               from "./component/pages/auth-pages/Login"
// import Register            from "./component/pages/register/Register"
import Menu                from "./component/pages/menu/Menu"
import Footer              from "./component/pages/footer/Footer"
import Layout              from "./component/pages/layout/Layout"
import ProductDetail       from "./component/pages/producto/ProductDetail"
import CatalogPage         from "./component/pages/catalog/CatalogPage"
import ContactPage         from "./component/pages/contacto/ContactPage"
import AdminPanel          from "./component/pages/admin/Admin"
import ProtecterRouter     from "./component/auth/ProtecterRouter"
import CartPage            from "./component/cart/CartPage"
import CheckoutPage        from "./component/checkout/CheckoutPage"
import OrdenConfirmadaPage from "./component/orden-confirmada/OrdenConfirmadaPage"
import './App.css'

function App() {
  return (
    <HashRouter>
      <CartProvider>
        <Menu />
        <Layout>
          <Routes>
            <Route path="/"                element={<HomePage />} />
            <Route path="/catalogo"        element={<CatalogPage />} />
            <Route path="/contacto"        element={<ContactPage />} />
            <Route path="/producto/:id"    element={<ProductDetail />} />
            <Route path="/carrito"         element={<CartPage />} />
            <Route path="/checkout"        element={<CheckoutPage />} />
            <Route path="/orden-confirmada" element={<OrdenConfirmadaPage />} />
            <Route path="/Login"           element={<Login />} />
            {/* <Route path="/Register"        element={<Register />} /> */}
            <Route path="/Admin" element={
              <ProtecterRouter>
                <AdminPanel />
              </ProtecterRouter>
            } />
            <Route path="*" element={<p>Not Found</p>} />
          </Routes>
        </Layout>
        <Footer />
      </CartProvider>
    </HashRouter>
  )
}

export default App
