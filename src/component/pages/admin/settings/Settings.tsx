import React, { useState, useEffect } from 'react'
import { fetchSettings } from '../../../../services/settingsService'
import type { StoreSettings } from '../../../../types/admin'
import SettingsGeneral from './tabs/SettingsGeneral'
import SettingsSocial  from './tabs/SettingsSocial'
import SettingsHero    from './tabs/SettingsHero'

type Tab = 'general' | 'social' | 'hero'

const TABS: { key: Tab; label: string }[] = [
  { key: 'general', label: 'Configuración General' },
  { key: 'social',  label: 'Redes Sociales' },
  { key: 'hero',    label: 'Hero' },
]

const Settings = () => {
  const [tab, setTab]         = useState<Tab>('general')
  const [settings, setSettings] = useState<StoreSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
      .then(data => { setSettings(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return <div style={{ color: 'var(--vsm-gray-mid)', fontSize: '13px' }}>Cargando configuración...</div>
  }

  const tabBtn = (active: boolean): React.CSSProperties => ({
    padding: '8px 18px',
    fontSize: '13px',
    fontWeight: active ? 700 : 500,
    fontFamily: 'inherit',
    background: 'none',
    border: 'none',
    borderBottom: active ? '2px solid var(--vsm-brand)' : '2px solid transparent',
    color: active ? 'var(--vsm-brand)' : 'var(--vsm-gray-mid)',
    cursor: 'pointer',
    transition: 'color 0.15s, border-color 0.15s',
  })

  return (
    <div>
      <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--vsm-black)', marginBottom: '1.25rem' }}>
        Configuración de la tienda
      </h2>

      <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--vsm-gray)', marginBottom: '1.75rem' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={tabBtn(tab === t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'general' && <SettingsGeneral settings={settings} />}
      {tab === 'social'  && <SettingsSocial  settings={settings} />}
      {tab === 'hero'    && <SettingsHero    settings={settings} />}
    </div>
  )
}

export default Settings
