import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import '../../style/imagecard.css';
import DeleteImage from '../DeleteImage';
import 'react-lazy-load-image-component/src/effects/blur.css';

export default function ImageCard(props){
    const [showModel, setShowModel] = useState(false);
    return <> 
        {showModel && <DeleteImage imgLabel={props.label} imageId={props.imgId} onClose={()=>setShowModel(false)} />}
    <div className='img-card'>
        <div className='img-overlay'></div>
        <span className='img-label'>{props.label}</span>
        <button className='delete-img' onClick={()=>setShowModel(true)}>delete</button>
        <LazyLoadImage src={props.image} alt={props.label} effect="blur" wrapperProps={{ style: { display: 'flex', color: 'transparent' } }} />
    </div>
    </>;
}