/**
 * firebase-config.js
 * Configuração e inicialização do Firebase — DAE Dashboard 2026
 * Compartilhado entre dashboard.html e formulario.html
 */

const firebaseConfig = {
    apiKey: "AIzaSyBt4N9gQ6DFXZ6d648kisGfLzrdjo0TohU",
    authDomain: "dae-dashboard-2026.firebaseapp.com",
    projectId: "dae-dashboard-2026",
    storageBucket: "dae-dashboard-2026.firebasestorage.app",
    messagingSenderId: "794919394282",
    appId: "1:794919394282:web:36c644769fb6a9312bb093"
};

// Inicializar apenas uma vez
if (!firebase.apps || firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
console.log('🔥 Firebase conectado! [firebase-config.js]');
