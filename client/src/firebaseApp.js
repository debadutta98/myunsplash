import {initializeApp } from 'firebase/app'
import {child, get, getDatabase, push, ref, remove, set} from 'firebase/database';
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
}
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const reference = ref(db,'myUnsplash/images');
/**
 * 
 * @param {{label: String; url: String;}} value
 * @returns {Promise<void>}
 */
export const setImage = async (value) => {
    return await push(reference,{
        imageLable: value.label,
        imageUrl: value.url
    });
}

export const getImageList = async () => {
    return await get(reference);
}
/**
 * 
 * @param {String} imageId 
 * @returns {Promise<void>}
 */
export const  deleteImage = async (imageId) => {
    return await remove(child(reference, imageId));
}
export default reference;