/**
 * Comprueba que las variables de entorno obligatorias estén presentes.
 * Si falta alguna, el proceso se detiene con un mensaje de error claro.
 */
const checkEnv = () => {
    const requiredEnv = [
        'DB_HOST', 
        'DB_USER', 
        'DB_PASSWORD', 
        'DB_NAME', 
        'JWT_SECRET'
    ];

    const missing = requiredEnv.filter(env => !process.env[env]);

    if (missing.length > 0) {
        console.error('🚨 ERROR CRÍTICO DE CONFIGURACIÓN');
        console.error('Faltan las siguientes variables en tu archivo .env:');
        missing.forEach(env => console.error(`   👉 ${env}`));
        console.error('\nPor favor, revisa tu archivo .env o .env.example antes de continuar.\n');
        
        process.exit(1); // Detener la aplicación
    }
};

module.exports = checkEnv;
