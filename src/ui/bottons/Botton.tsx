interface ButtonProps {
    children: React.ReactNode
    onClick?: () => void
    className?: string
    type?: "button" | "submit" | "reset"
}

const Button = ({ children, onClick, className = '', type = "button" }: ButtonProps) => {
    return (
        <button
            type={type}
            onClick={onClick}
            style={{ backgroundColor: 'var(--vsm-brand)', color: '#fff', borderRadius: '4px' }}
            className={`w-full py-3 mt-4 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity ${className}`}
        >
            {children}
        </button>
    )
}

export default Button
