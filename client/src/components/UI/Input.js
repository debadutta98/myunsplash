import React from "react";
import '../../style/input.css';
const Input = React.forwardRef((props,ref)=>{
return <input 
{...props}
ref={ref}
type={props.type || "text"} 
className={`input-style ${props.className}`}
/>
});

export default Input;