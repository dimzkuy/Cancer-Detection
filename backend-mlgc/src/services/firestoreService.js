const admin = require('firebase-admin');

// Inisialisasi Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(), // Atur kredensial sesuai kebutuhan
    });
}

// Dapatkan referensi ke Firestore
const db = admin.firestore();

/**
 * Menyimpan data prediksi ke Firestore
 * @param {Object} data - Data prediksi
 * @param {string} data.id - ID dokumen
 * @param {string} data.result - Hasil prediksi
 * @param {string} data.suggestion - Saran berdasarkan prediksi
 * @param {number} [data.confidence] - Tingkat kepercayaan (opsional)
 * @returns {Promise<void>}
 */
const savePrediction = async (data) => {
    try {
        const docRef = db.collection('predictions').doc(data.id);

        await docRef.set({
            id: data.id,
            result: data.result,
            suggestion: data.suggestion,
            confidence: data.confidence || null,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log(`Data dengan ID '${data.id}' berhasil disimpan.`);
    } catch (error) {
        console.error('Gagal menyimpan data ke Firestore:', error);
        throw new Error('Gagal menyimpan data ke Firestore.');
    }
};

/**
 * Mengambil data prediksi dari Firestore
 * @param {string} id - ID dokumen
 * @returns {Promise<Object>} - Data dokumen
 */
const getPrediction = async (id) => {
    try {
        const docRef = db.collection('predictions').doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            throw new Error(`Dokumen dengan ID '${id}' tidak ditemukan.`);
        }

        console.log(`Data dengan ID '${id}' berhasil diambil.`);
        return doc.data();
    } catch (error) {
        console.error('Gagal mengambil data dari Firestore:', error);
        throw new Error('Gagal mengambil data dari Firestore.');
    }
};

module.exports = { savePrediction, getPrediction };
