const tf = require('@tensorflow/tfjs-node');
const loadModelService = require('./loadModelService');

const preprocessImage = (imageBuffer) => {
    return tf.node.decodeImage(imageBuffer, 3)
        .resizeNearestNeighbor([224, 224]) // Ubah ukuran gambar ke 224x224
        .toFloat()
        .expandDims()
        .div(255.0); // Normalisasi ke [0, 1]
};

const predict = async (imageBuffer) => {
    const model = await loadModelService.loadModel();
    const preprocessedImage = preprocessImage(imageBuffer);

    // Lakukan prediksi
    const predictions = model.predict(preprocessedImage).dataSync();
    console.log('Prediksi:', predictions);

    // Klasifikasi hasil
    const result = predictions[0] > 0.5 ? 'Cancer' : 'Non-cancer';
    return {
        result,
        confidence: predictions[0], // Confidence score
        suggestion: result === 'Cancer' ? 'Segera periksa ke dokter!' : 'Penyakit kanker tidak terdeteksi.',
    };
};

module.exports = { predict };
