export default function Button({ onClick, className, disabled, style, children,}) {

    return (

        <button 
        className={className}
        onClick={onClick}
        style={style}
        disabled={disabled}
      >
        {children}
      </button>
    )
}