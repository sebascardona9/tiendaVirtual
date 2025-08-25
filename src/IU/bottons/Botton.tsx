interface ButtonProps {
    children: React.ReactNode
    onClick?: () => void
    className?: string
    type?: "button" | "submit" | "reset" | undefined
}

const Button = ({children, onClick, className = '', type="button"}: ButtonProps) => {
    return (
        <button
        type={type}
        onClick={onClick}
        className =
            {`
               w-full py-2 mt-4
             text-white
             bg-blue-600 rounded-lg
             hover:bg-blue-700 transition duration-200
                ${className}`
            }
        
        >    

        {children}

        </button>
    )


}

export default Button