const NewsletterSection = () => (
    <section
        style={{ backgroundColor: 'var(--vsm-brand)', color: '#fff' }}
        className="py-16 px-8 text-center"
    >
        <h2 style={{ fontWeight: 800, fontSize: '1.75rem', marginBottom: '0.5rem' }}>
            Regístrate y obtén 10% OFF
        </h2>
        <p style={{ fontSize: '15px', opacity: 0.85, marginBottom: '2rem' }}>
            en tu primera compra
        </p>
        <form
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
        >
            <input
                type="email"
                placeholder="tu@correo.com"
                style={{
                    flex: 1, padding: '12px 16px', borderRadius: '5px',
                    border: 'none', fontSize: '14px', outline: 'none',
                    color: 'var(--vsm-black)',
                }}
            />
            <button
                type="submit"
                style={{
                    backgroundColor: '#111', color: '#fff', padding: '12px 24px',
                    borderRadius: '5px', border: 'none', fontSize: '12px',
                    fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em',
                    cursor: 'pointer', whiteSpace: 'nowrap',
                }}
                className="hover:opacity-90 transition-opacity"
            >
                Obtener mi 10% OFF
            </button>
        </form>
    </section>
)

export default NewsletterSection
