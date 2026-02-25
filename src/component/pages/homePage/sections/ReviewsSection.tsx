const reviews = [
    {
        stars: 5,
        text: '"Las velas más hermosas que he tenido. El aroma a coco me transporta directamente al Caribe. ¡Las recomiendo 100%!"',
        author: 'María Martínez, Bogotá',
    },
    {
        stars: 5,
        text: '"Compré el pack de lavanda y sándalo para regalar y quedaron fascinados. La presentación es preciosa y el aroma dura muchísimo."',
        author: 'Andrés Gómez, Medellín',
    },
    {
        stars: 5,
        text: '"Calidad artesanal increíble. Se nota que están hechas con amor y buenos materiales. Ya pedí mi tercer pedido."',
        author: 'Lucía Herrera, Cali',
    },
]

const ReviewsSection = () => (
    <section id="nosotros" style={{ backgroundColor: 'var(--vsm-bg)' }} className="py-20 px-8">
        <div className="max-w-7xl mx-auto">
            <h2 style={{ fontWeight: 800, fontSize: '1.6rem', textAlign: 'center', color: 'var(--vsm-black)', marginBottom: '2.5rem' }}>
                Lo que dicen nuestros clientes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reviews.map((r, i) => (
                    <div
                        key={i}
                        style={{ backgroundColor: 'var(--vsm-white)', borderRadius: 'var(--vsm-radius)', padding: '1.5rem', boxShadow: 'var(--vsm-shadow-sm)' }}
                    >
                        <div style={{ fontSize: '14px', color: '#F5A623', marginBottom: '0.75rem' }}>
                            {'★'.repeat(r.stars)}
                        </div>
                        <p style={{ color: 'var(--vsm-gray-mid)', fontSize: '14px', lineHeight: 1.75, marginBottom: '1rem', fontStyle: 'italic' }}>
                            {r.text}
                        </p>
                        <p style={{ fontWeight: 700, fontSize: '12px', color: 'var(--vsm-black)' }}>
                            — {r.author}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    </section>
)

export default ReviewsSection
