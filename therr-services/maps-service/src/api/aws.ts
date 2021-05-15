import { Storage } from '@google-cloud/storage';

console.log('ZACK', process.env.MAPS_SERVICE_GOOGLE_CREDENTIALS_BASE64);

const storage = new Storage({
    credentials: JSON.parse(Buffer.from(process.env.MAPS_SERVICE_GOOGLE_CREDENTIALS_BASE64 || 'e30=', 'base64').toString('utf8')),
});

export {
    storage,
};
