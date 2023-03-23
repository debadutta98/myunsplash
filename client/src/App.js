import Header from "./components/Header";
import Gallery from "./components/Gallery";
import { useEffect, useMemo, useState } from "react";
import reference, { getImageList } from "./firebaseApp";
import { onValue } from "firebase/database";

function App() {
  const [images, setImages] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const imageResults = useMemo(() => {
    if(searchResults.length > 0) {
      return searchResults;
    } else {
      return images;
    }
  }, [searchResults, images]);
  useEffect(()=>{
    const updateImageList=(snapshot) => {
      const imageList = [];
      if (snapshot.exists()) {
        const imagesObj = snapshot.exportVal();
        for (const imageId of Object.keys(snapshot.exportVal())) {
          imageList.push({
            id: imageId,
            ...imagesObj[imageId]
          })
        }
    } 
    setImages(imageList);
  };
  const updateImageListError = (error) => {
    console.error(error);
  };
    getImageList().then(updateImageList).catch(updateImageListError)
    onValue(reference,updateImageList,updateImageListError)
  },[]);
  useEffect(()=>{
    if(!searchInput){
      setSearchResults([]);
    } else {
      setIsLoading(true);
      const timeout = setTimeout((input,imageList) => {

        const filterImages = imageList.filter((value) => value.imageLable.toLowerCase().includes(input.toLowerCase()));
        setSearchResults(filterImages);
        setIsLoading(false);
      }, 500, searchInput,images);
      return ()=>clearTimeout(timeout);
    }
  },[searchInput, images]);
  // render result
  let result = <Gallery images={imageResults} />;
  if (searchInput && searchResults.length === 0 && !isLoading) {
      result = <p style={{ marginTop: '3rem', textAlign: 'center', fontFamily: 'Noto Sans' }}>No Result Found</p>;
  }
  return <>
    <Header onSearchInputChange={(event) => {
      setSearchInput(event.target.value)
    }}/>
    {result}
    </>;
}

export default App;
