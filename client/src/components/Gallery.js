import '../style/gallery.css';
import ImageCard from './UI/ImageCard';
import React from 'react';
const Gallery = ({images}) => {
    let imageList = [[],[],[]];
    if(images.length > 0) {
        let i=0;
        let read = 0;
        while (i >= 0 && images.length > read){
            for (let j = 0; j < 3 && images.length > read; j++) {
                imageList[j][i]=images[read++];
            }
            i++;
        }
    }
    return (imageList[0].length === 0 ? 
        <p style={{ marginTop:'3rem', textAlign:'center', fontFamily: 'Noto Sans' }}>No Results Found</p> : 
        <div className="grid-layout"> 
            {imageList[0].length > 0 && <div className='grid-layout-col'>{imageList[0].map((img) => <ImageCard key={img.id} label={img.imageLable} image={img.imageUrl} imgId={img.id} />)}</div>}
            {imageList[1].length > 0 && <div className='grid-layout-col'>{imageList[1].map((img) => <ImageCard key={img.id} label={img.imageLable} image={img.imageUrl} imgId={img.id}  />)}</div>}
            {imageList[2].length > 0 && <div className='grid-layout-col'>{imageList[2].map((img) => <ImageCard key={img.id} label={img.imageLable} image={img.imageUrl} imgId={img.id}  />)}</div>}
        </div>
    )
};

export default React.memo(Gallery);