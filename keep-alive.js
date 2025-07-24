// Script para mantener la aplicación activa
// Ejecutar en consola del navegador o como extensión

const PING_URL = 'https://7f53013f-29e2-4762-bcb8-277c7703c063-00-1m1sp2kxx4hr3.picard.replit.dev/api/stats';

function keepAlive() {
  fetch(PING_URL)
    .then(response => {
      if (response.ok) {
        console.log(`✅ Ping exitoso - ${new Date().toLocaleTimeString()}`);
      } else {
        console.log(`⚠️  Ping falló - ${new Date().toLocaleTimeString()}`);
      }
    })
    .catch(error => {
      console.log(`❌ Error en ping - ${new Date().toLocaleTimeString()}:`, error.message);
    });
}

// Ping cada 10 minutos
setInterval(keepAlive, 10 * 60 * 1000);

// Ping inicial
keepAlive();

console.log('🚀 Keep-alive iniciado. Enviando ping cada 10 minutos...');