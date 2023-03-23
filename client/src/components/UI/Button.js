import '../../style/button.css';
export default function Button(props) {
    return <button {...props} className={`btn ${props.className}`}>{props.children}</button>
}