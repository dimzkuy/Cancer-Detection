const tf = require('@tensorflow/tfjs-node');

let model = null;

const loadModel = async () => {
    if (!model) {
        try {
            const modelUrl = 'https://storage.googleapis.com/asclepius-dimascahyo/model.json';
            console.log('Memuat model dari:', modelUrl);
            model = await tf.loadGraphModel(modelUrl); // Gunakan loadGraphModel untuk model SavedModel
            console.log('Model berhasil dimuat.');
        } catch (error) {
            console.error('Error saat memuat model:', error.message);
            throw new Error('Gagal memuat model dari Cloud Storage.');
        }
    }
    return model;
};

module.exports = { loadModel };
