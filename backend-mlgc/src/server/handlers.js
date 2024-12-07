const { loadModel } = require('../services/loadModelService');
const tf = require('@tensorflow/tfjs-node');
const { v4: uuidv4 } = require('uuid');

const predictHandler = async (request, h) => {
    try {
        const { image } = request.payload;

        if (!image) {
            throw new Error('Gambar tidak ditemukan dalam permintaan.');
        }

        console.log('Payload diterima:', image.hapi.filename);

        // Muat model
        const model = await loadModel();
        console.log('Model berhasil dimuat.');

        // Preprocessing gambar
        let tensor = tf.node.decodeImage(image._data);
        console.log('Shape tensor sebelum resize:', tensor.shape);

        tensor = tf.image.resizeBilinear(tensor, [224, 224]);
        console.log('Shape tensor setelah resize:', tensor.shape);

        if (tensor.shape[2] === 1) {
            tensor = tf.image.grayscaleToRGB(tensor);
            console.log('Tensor setelah konversi grayscale ke RGB:', tensor.shape);
        }

        tensor = tensor.expandDims(0);
        console.log('Shape tensor final:', tensor.shape);

        // Eksekusi prediksi
        const inputTensor = { 'MobilenetV3large_input': tensor }; // Ganti dengan nama input layer model Anda
        const predictionTensor = model.execute(inputTensor);
        const prediction = predictionTensor.dataSync();

        console.log('Hasil prediksi dari model:', prediction);

        if (!prediction || prediction.length === 0) {
            throw new Error('Model tidak memberikan hasil prediksi.');
        }

        // Interpretasi hasil prediksi
        const isCancer = prediction[0] === 1; // Asumsi 1 = Cancer, 0 = Non-cancer
        const responseData = {
            id: uuidv4(),
            result: isCancer ? 'Cancer' : 'Non-cancer',
            suggestion: isCancer ? 'Segera periksa ke dokter!' : 'Penyakit kanker tidak terdeteksi.',
            createdAt: new Date().toISOString(),
        };

        console.log('Data respons:', responseData);

        return h.response({
            status: 'success',
            message: 'Model is predicted successfully',
            data: responseData,
        }).code(201);
    } catch (error) {
        console.error('Error dalam prediksi:', error.message);

        if (error.output?.statusCode === 413) {
            return h.response({
                status: 'fail',
                message: `Payload content length greater than maximum allowed: 1000000`,
            }).code(413);
        }

        return h.response({
            status: 'fail',
            message: 'Terjadi kesalahan dalam melakukan prediksi',
        }).code(400);
    }
};

module.exports = { predictHandler };
