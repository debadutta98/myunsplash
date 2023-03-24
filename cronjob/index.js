// cron job
//imports
import admin from 'firebase-admin';
import { getDatabase } from 'firebase-admin/database';
import PQueue from 'p-queue';
import {config} from 'dotenv';
import axios from 'axios';
import { createRequire } from "module";
import { Agent } from 'https';
import { URL } from 'url';

const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

config({path: './.env' });
const imageCount = parseInt(process.env.CONSTANT_IMAGE_COUNT || "42");

// firebase app initializer
const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://react-practice-9211b-default-rtdb.firebaseio.com"
});
const db = getDatabase(app);
const rootRef = db.ref('myUnsplash/images');

const convertDescription = (str) => {
    if(str) {
        const description = str.charAt(0).toUpperCase() + str.slice(1);
        return description;
    } else {
        return 'A Simple Picture - ' + Math.floor((Math.random() * 100) + 1)
    }
};

const httpsAgent = new Agent({
    maxSockets: Infinity,
    keepAlive: true
});

const getImageList = async () => {
try {
    const snapshot = await rootRef.get();
    const count = imageCount - snapshot.val.length;
    if(count > 0) {
        const response = await axios.get('https://api.unsplash.com/photos/random/', {
            params: {
                count: count > 30 ? 30: count,
                client_id: process.env.UNSPLASH_ACCESS_KEY
            },
            httpsAgent
        })
        if (response.status === 200) {
            const remainingRequest = +response.headers['X-Ratelimit-Remaining'];
            if (Array.isArray(response.data)) {
                return {
                    imageList: response.data.map((value) => {
                        const url = new URL(value.urls.full);
                        return {
                            imageLable: convertDescription(value.description),
                            imageUrl: url.origin + url.pathname + '?q=10'
                        }
                }),
                    remainingRequest
                }
            } else {
                return null;
            }
        } else {
            return null;
        }
    } else {
        return null;
    }
} catch (error) {
    console.error('unsplash request error', error);
    return null;
}
}
const q = new PQueue({
concurrency: 1,
autoStart: true
})
let lock = false;
q.on('empty',()=>{
    console.log('Queue is now empty',q.size);
})
q.on('add',()=>{
    console.log('A task is added',q.size);
})
q.on('next',()=>{
    console.log('A task is completed',q.size);
})
q.on('error',(error)=>{
    console.error('An error occured',error);
})
q.on('idle', ()=>{
    console.log('Queue is idle now');
})
q.on('completed',async (result)=>{
    if(result){
        for (const image of result.imageList) {
            const pushref = rootRef.push();
            try {
                await pushref.set(image)
            } catch (error) {
                console.error('database writing error', error);
            }
        } 
        if(result.remainingRequest > 0) {
            lock = true;
            q.clear();
            await q.add(function(){
                return new Promise((resolve)=>{
                    setTimeout(async () => {
                        resolve(await getImageList()) 
                    }, 36_10_000);
                });
            })
        } else {
            lock = false;
        }
    }
});

rootRef.limitToFirst(imageCount).on('child_removed',async (snapshot)=>{
    if(!lock) {
        await q.add(async function(){
            return await getImageList();
        });
    }
});
