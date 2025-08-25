// src/components/Footer.tsx
import { Link } from 'react-router-dom';
import { footerData } from './FooterLinks';

const Footer = () => (
  <footer className="bg-gray-100 text-gray-700 py-12">
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4">
      
      {/* Renderizar las secciones dinámicamente */}
      {footerData.map((section, index) => (
        <div key={index}>
          <h3 className="font-semibold mb-3">{section.title}</h3>
          <ul className="space-y-2">
            {section.links.map((link, idx) => (
              <li key={idx}>
                <Link to={link.path} className="hover:text-gray-900">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Sección Suscríbete */}
      <div className="md:col-span-2">
        <h3 className="font-semibold mb-3">SUSCRÍBETE</h3>
        <p className="mb-4">Únete para obtener promociones, descuentos y más ❤️</p>
        <form className="flex max-w-md">
          <input
            type="email"
            placeholder="Tu correo"
            className="flex-grow p-2 border border-gray-300 rounded-l"
          />
          <button type="submit" className="bg-gray-900 text-white px-4 rounded-r">
            Unirme
          </button>
        </form>
        <div className="mt-4 space-x-4">
          {/* Aquí puedes agregar iconos reales de medios de pago */}
          <span>AmEx</span><span>Visa</span><span>Mastercard</span>
        </div>
      </div>
    </div>

    <div className="border-t border-gray-300 mt-12 pt-6">
      <p className="text-center text-sm">© 2025 ANGELA MARIA ARISTIZABAL ACCESORIOS</p>
      <p className="text-center text-sm mt-2">Each pair a unique masterpiece from our artisans to you</p>
    </div>
  </footer>
);

export default Footer;
