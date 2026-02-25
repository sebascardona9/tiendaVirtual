import { useState, useMemo } from 'react'
import type { Product, Category } from '../../../../types/admin'

interface Props {
  products: Product[]
  categories: Category[]
}

const StockCard = ({ products, categories }: Props) => {
  const [open, setOpen]               = useState(false)
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set())
  const [expandedSubs, setExpandedSubs] = useState<Set<string>>(new Set())

  const totalStock = useMemo(
    () => products.reduce((sum, p) => sum + (p.stock ?? 0), 0),
    [products]
  )

  // categoryId → Product[]
  const byCat = useMemo(() => {
    const m = new Map<string, Product[]>()
    for (const p of products) {
      const k = p.categoryId || '__none__'
      if (!m.has(k)) m.set(k, [])
      m.get(k)!.push(p)
    }
    return m
  }, [products])

  // categoryId → subcategoryId → Product[]
  const bySubInCat = useMemo(() => {
    const outer = new Map<string, Map<string, Product[]>>()
    for (const p of products) {
      const ck = p.categoryId  || '__none__'
      const sk = p.subcategoryId || '__none__'
      if (!outer.has(ck)) outer.set(ck, new Map())
      const inner = outer.get(ck)!
      if (!inner.has(sk)) inner.set(sk, [])
      inner.get(sk)!.push(p)
    }
    return outer
  }, [products])

  const sumStock = (prods: Product[]) =>
    prods.reduce((s, p) => s + (p.stock ?? 0), 0)

  const toggleSet = (
    id: string,
    setter: React.Dispatch<React.SetStateAction<Set<string>>>
  ) => {
    setter(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // Ordered list of categories that have products (follows Firestore order)
  const catEntries = useMemo(() => {
    const result: { id: string; name: string }[] = []
    for (const cat of categories) {
      if (byCat.has(cat.id)) result.push({ id: cat.id, name: cat.name })
    }
    if (byCat.has('__none__')) result.push({ id: '__none__', name: 'Sin categoría' })
    return result
  }, [categories, byCat])

  const chevron = (isOpen: boolean) => (
    <span style={{
      fontSize: '10px',
      color: 'var(--vsm-gray-mid)',
      display: 'inline-block',
      transform: isOpen ? 'rotate(180deg)' : 'none',
      transition: 'transform 0.2s',
      flexShrink: 0,
    }}>▼</span>
  )

  const productRow = (p: Product, indent: string) => (
    <div
      key={p.id}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `0.35rem 1.5rem 0.35rem ${indent}`,
      }}
    >
      <span style={{
        fontSize: '12px',
        color: p.active === false ? 'var(--vsm-gray-mid)' : 'var(--vsm-black)',
        flex: 1,
        marginRight: '0.75rem',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontStyle: p.active === false ? 'italic' : 'normal',
      }}>
        {p.name}
      </span>
      <span style={{
        fontSize: '12px',
        fontWeight: 700,
        color: p.stock === 0 ? 'var(--vsm-error)' : 'var(--vsm-gray-mid)',
        flexShrink: 0,
      }}>
        {p.stock} uds.
      </span>
    </div>
  )

  return (
    <div style={{
      backgroundColor: 'var(--vsm-white)',
      borderRadius: 'var(--vsm-radius)',
      borderTop: '3px solid var(--vsm-brand)',
      boxShadow: 'var(--vsm-shadow-sm)',
      overflow: 'hidden',
    }}>
      {/* Header — siempre visible */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          padding: '1.25rem 1.5rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          userSelect: 'none',
        }}
      >
        <div>
          <p style={{ fontSize: '13px', color: 'var(--vsm-gray-mid)', fontWeight: 600, marginBottom: '0.5rem' }}>
            Stock Total
          </p>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--vsm-brand)', lineHeight: 1 }}>
            {totalStock}
            <span style={{ fontSize: '0.875rem', fontWeight: 600, marginLeft: '0.35rem' }}>uds.</span>
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
          <span style={{ fontSize: '11px', color: 'var(--vsm-gray-mid)' }}>
            {open ? 'Ocultar' : 'Ver detalle'}
          </span>
          {chevron(open)}
        </div>
      </div>

      {/* Contenido desplegable */}
      {open && (
        <div style={{ borderTop: '1px solid var(--vsm-gray)', maxHeight: '400px', overflowY: 'auto' }}>
          {catEntries.length === 0 ? (
            <p style={{ padding: '0.75rem 1.5rem', fontSize: '13px', color: 'var(--vsm-gray-mid)' }}>
              Sin productos
            </p>
          ) : catEntries.map(cat => {
            const catProds  = byCat.get(cat.id) || []
            const catStock  = sumStock(catProds)
            const catOpen   = expandedCats.has(cat.id)
            const subGroups = bySubInCat.get(cat.id) || new Map<string, Product[]>()
            const hasSubcats = catProds.some(p => !!p.subcategoryId)

            // Armar entradas de subcategorías
            const subEntries: { id: string; name: string; prods: Product[] }[] = []
            subGroups.forEach((prods, subId) => {
              if (subId === '__none__') return
              const name = prods[0]?.subcategoryName || 'Subcategoría'
              subEntries.push({ id: subId, name, prods })
            })
            const noSubProds = subGroups.get('__none__') || []
            if (noSubProds.length > 0 && hasSubcats) {
              subEntries.push({ id: `${cat.id}__nosub`, name: 'Sin subcategoría', prods: noSubProds })
            }

            return (
              <div key={cat.id} style={{ borderBottom: '1px solid var(--vsm-gray)' }}>

                {/* Fila categoría */}
                <div
                  onClick={() => toggleSet(cat.id, setExpandedCats)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.6rem 1.5rem',
                    cursor: 'pointer',
                    userSelect: 'none',
                    backgroundColor: catOpen ? 'rgba(201,107,43,0.05)' : 'transparent',
                  }}
                >
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--vsm-black)' }}>
                    {cat.name}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--vsm-brand)' }}>
                      {catStock} uds.
                    </span>
                    {chevron(catOpen)}
                  </div>
                </div>

                {/* Categoría expandida */}
                {catOpen && (
                  <div>
                    {hasSubcats ? (
                      subEntries.map(sub => {
                        const subStock = sumStock(sub.prods)
                        const subOpen  = expandedSubs.has(sub.id)
                        return (
                          <div key={sub.id}>
                            {/* Fila subcategoría */}
                            <div
                              onClick={() => toggleSet(sub.id, setExpandedSubs)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0.45rem 1.5rem 0.45rem 2.75rem',
                                cursor: 'pointer',
                                userSelect: 'none',
                                backgroundColor: subOpen
                                  ? 'rgba(201,107,43,0.08)'
                                  : 'rgba(201,107,43,0.03)',
                              }}
                            >
                              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--vsm-gray-mid)' }}>
                                {sub.name}
                              </span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--vsm-brand)' }}>
                                  {subStock} uds.
                                </span>
                                {chevron(subOpen)}
                              </div>
                            </div>
                            {/* Productos de la subcategoría */}
                            {subOpen && sub.prods.map(p => productRow(p, '4rem'))}
                          </div>
                        )
                      })
                    ) : (
                      /* Sin subcategorías — productos directo bajo la categoría */
                      catProds.map(p => productRow(p, '2.75rem'))
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default StockCard
