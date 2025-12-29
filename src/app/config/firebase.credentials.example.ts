/**
 * ============================================
 * 📋 PLANTILLA DE CREDENCIALES DE FIREBASE
 * ============================================
 * 
 * INSTRUCCIONES:
 * 1. Copia este archivo y renómbralo a: firebase.credentials.ts
 * 2. Reemplaza los valores con tus credenciales de Firebase
 * 3. El archivo firebase.credentials.ts está en .gitignore (no se sube)
 * 
 * OBTENER CREDENCIALES:
 * 1. Ve a Firebase Console: https://console.firebase.google.com/
 * 2. Selecciona tu proyecto (o crea uno nuevo)
 * 3. Ve a ⚙️ Configuración del proyecto > General
 * 4. En "Tus apps", agrega una app web si no tienes
 * 5. Copia los valores de firebaseConfig
 * 
 * CONFIGURAR REMOTE CONFIG:
 * 1. En Firebase Console, ve a Remote Config
 * 2. Crea los siguientes parámetros:
 *    - enable_categories (Boolean) = true
 *    - enable_dark_mode (Boolean) = false
 *    - max_tasks (Number) = 100
 * 3. Publica los cambios
 */

export const firebaseConfig = {
  apiKey: "PEGA_AQUI_TU_API_KEY",
  authDomain: "PEGA_AQUI_TU_AUTH_DOMAIN",
  projectId: "PEGA_AQUI_TU_PROJECT_ID",
  storageBucket: "PEGA_AQUI_TU_STORAGE_BUCKET",
  messagingSenderId: "PEGA_AQUI_TU_MESSAGING_SENDER_ID",
  appId: "PEGA_AQUI_TU_APP_ID",
  measurementId: "PEGA_AQUI_TU_MEASUREMENT_ID" // Opcional
};

export const remoteConfigDefaults = {
  enable_categories: true,
  enable_dark_mode: false,
  max_tasks: 100
};
