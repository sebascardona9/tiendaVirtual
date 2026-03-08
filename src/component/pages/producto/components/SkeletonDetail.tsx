const SkeletonDetail = () => (
  <div className="w-full" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
    <div style={{
      width: '140px', height: '14px',
      backgroundColor: 'var(--vsm-gray)', borderRadius: '4px',
      marginBottom: '2rem', animation: 'pulse 1.5s ease-in-out infinite',
    }} />

    <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-8 md:gap-12">
      <div>
        <div style={{
          aspectRatio: '1', backgroundColor: 'var(--vsm-gray)',
          borderRadius: '12px', animation: 'pulse 1.5s ease-in-out infinite',
        }} />
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: '72px', height: '72px',
              backgroundColor: 'var(--vsm-gray)', borderRadius: 'var(--vsm-radius)',
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[
          { w: '80px',  h: '24px', r: '20px' },
          { w: '75%',   h: '36px', r: '6px'  },
          { w: '45%',   h: '32px', r: '6px'  },
          { w: '100%',  h: '80px', r: '6px'  },
        ].map((s, i) => (
          <div key={i} style={{
            width: s.w, height: s.h,
            backgroundColor: 'var(--vsm-gray)', borderRadius: s.r,
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
        ))}
        <div style={{
          width: '100%', height: '50px',
          backgroundColor: 'var(--vsm-gray)', borderRadius: 'var(--vsm-radius)',
          marginTop: '0.5rem', animation: 'pulse 1.5s ease-in-out infinite',
        }} />
      </div>
    </div>
  </div>
)

export default SkeletonDetail
