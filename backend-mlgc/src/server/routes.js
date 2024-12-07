const handlers = require('./handlers');

const routes = [
    {
        method: 'POST',
        path: '/predict',
        handler: handlers.predictHandler,
        options: {
            payload: {
                allow: 'multipart/form-data', // Izinkan multipart
                output: 'stream', // Gunakan mode stream untuk menangani file
                parse: true, // Parsing otomatis
                maxBytes: 1000000, // Batas ukuran file (1 MB)
                multipart: true, // Pastikan parsing mendukung multipart
            },
        },
    },
];

module.exports = routes;
