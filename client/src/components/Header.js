import Input from "./UI/Input";
import '../style/header.css';
import Button from "./UI/Button";
import { useState } from "react";
import AddImage from "./AddImage";

export default function Header(props){
    const [addPhoto, setAddPhoto] = useState(false);
    return <header>
        {addPhoto && <AddImage onClose={()=> setAddPhoto(false)}/>}
        <div className="header-container">
            <a href="/">
                <img src="./assets/img/my_unsplash_logo.svg" alt="logo" />
            </a>
            <Input type="text" placeholder="Search by name" className="search-box" onChange={props.onSearchInputChange}/>
        </div>
        <div className="header-container">
        <Button className="add-photo" onClick={()=> setAddPhoto(true)}>Add a photo</Button>
        </div>
    </header>
}