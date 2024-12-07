const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
    const server = Hapi.server({
        port: 8080,
        host: 'localhost',
        routes: {
            payload: {
                maxBytes: 1000000, // Batas maksimum payload 1 MB
            },
        },
    });

    server.route(routes);

    // Tangani error global untuk payload besar
    server.ext('onPreResponse', (request, h) => {
        const { response } = request;

        if (response.isBoom && response.output.statusCode === 413) {
            return h.response({
                status: 'fail',
                message: 'Payload content length greater than maximum allowed: 1000000',
            }).code(413);
        }

        return h.continue;
    });

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
