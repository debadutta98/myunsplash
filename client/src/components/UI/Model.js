import React, { useEffect } from "react";
import ReactDom from "react-dom";
import '../../style/model.css';
export default function Model(props){
    return ReactDom.createPortal(<>
        <div className="model">
            {props.children}
        </div>
    <div className="model-overlay"></div>
    </>, 
        document.getElementById('model-container'));
}