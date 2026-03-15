import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/authContext'
import type { AdminSection, Message } from '../../../types/admin'
import useCollection from '../../../hooks/useCollection'
import Dashboard       from './dashboard/Dashboard'
import ProductList     from './products/ProductList'
import Settings        from './settings/Settings'
import MessagesSection from './messages/MessagesSection'
import OrdenesPage     from './ordenes/OrdenesPage'

const navItems: { id: AdminSection; label: string }[] = [
  { id: 'dashboard',     label: 'Dashboard'      },
  { id: 'productos',     label: 'Productos'      },
  { id: 'ordenes',       label: 'Órdenes'        },
  { id: 'configuracion', label: 'Configuración'  },
  { id: 'mensajes',      label: 'Mensajes'       },
]

const AdminPanel = () => {
  const { user, logout }              = useAuth()
  const navigate                      = useNavigate()
  const [section, setSection]         = useState<AdminSection>('dashboard')

  const { data: allMessages } = useCollection<Message>('messages')
  const unreadCount = useMemo(() => allMessages.filter(m => !m.read).length, [allMessages])

  const handleLogout = async () => {
    await logout()
    navigate('/Login')
  }

  const displayName = user?.displayName ?? user?.email ?? 'Admin'

  const sidebarBtn = (item: typeof navItems[0]): React.CSSProperties => ({
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '10px 14px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: section === item.id ? 'var(--vsm-brand)' : 'transparent',
    color:           section === item.id ? '#fff' : 'var(--vsm-gray-mid)',
    fontWeight:      section === item.id ? 700 : 600,
    fontSize: '13px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'background-color 0.15s, color 0.15s',
  })

  return (
    <div
      style={{ minHeight: 'calc(100vh - 96px)', padding: '2rem 1rem' }}
      className="max-w-6xl w-full mx-auto"
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid var(--vsm-gray)',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--vsm-black)' }}>
            Panel de Administración
          </h1>
          <p style={{ color: 'var(--vsm-gray-mid)', fontSize: '13px', marginTop: '4px' }}>
            Hola, <strong style={{ color: 'var(--vsm-black)' }}>{displayName}</strong>
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: 'var(--vsm-black)',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '5px',
            border: 'none',
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            cursor: 'pointer',
            fontFamily: 'inherit',
            whiteSpace: 'nowrap',
          }}
          className="hover:opacity-80 transition-opacity"
        >
          Cerrar sesión
        </button>
      </header>

      {/* Body: sidebar + main */}
      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>

        {/* Sidebar — desktop */}
        <nav
          className="hidden md:flex"
          style={{ flexDirection: 'column', width: 200, flexShrink: 0, gap: '0.25rem' }}
        >
          {navItems.map(item => (
            <button key={item.id} onClick={() => setSection(item.id)} style={sidebarBtn(item)}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                {item.label}
                {item.id === 'mensajes' && unreadCount > 0 && (
                  <span style={{
                    backgroundColor: section === 'mensajes' ? '#fff' : 'var(--vsm-brand)',
                    color:           section === 'mensajes' ? 'var(--vsm-brand)' : '#fff',
                    fontSize: '10px',
                    fontWeight: 700,
                    borderRadius: '999px',
                    padding: '1px 6px',
                    lineHeight: 1.6,
                  }}>
                    {unreadCount}
                  </span>
                )}
              </span>
            </button>
          ))}
        </nav>

        {/* Tab row — mobile */}
        <nav
          className="flex md:hidden"
          style={{ width: '100%', borderBottom: '1px solid var(--vsm-gray)', paddingBottom: '0.5rem', gap: '0.25rem' }}
        >
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              style={{
                flex: 1,
                padding: '8px 4px',
                borderRadius: '5px',
                border: 'none',
                backgroundColor: section === item.id ? 'var(--vsm-brand)' : 'transparent',
                color:           section === item.id ? '#fff' : 'var(--vsm-gray-mid)',
                fontWeight: section === item.id ? 700 : 600,
                fontSize: '12px',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {item.label}
              {item.id === 'mensajes' && unreadCount > 0 && (
                <span style={{
                  backgroundColor: section === 'mensajes' ? '#fff' : 'var(--vsm-brand)',
                  color:           section === 'mensajes' ? 'var(--vsm-brand)' : '#fff',
                  fontSize: '9px',
                  fontWeight: 700,
                  borderRadius: '999px',
                  padding: '0px 5px',
                  marginLeft: '3px',
                  verticalAlign: 'middle',
                }}>
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Main content */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {section === 'dashboard'     && <Dashboard />}
          {section === 'productos'     && <ProductList />}
          {section === 'ordenes'       && <OrdenesPage />}
          {section === 'configuracion' && <Settings />}
          {section === 'mensajes'      && <MessagesSection />}
        </main>
      </div>
    </div>
  )
}

export default AdminPanel
