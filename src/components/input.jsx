export default function Input({ onChange, value, checked, type, className, placeholder }) {

    return(
    <input 
        onChange={onChange}
        value={value}
        type={type}
        className={className} 
        placeholder={placeholder}
        checked={checked}
         />
    )
}