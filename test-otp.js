// Test script para enviar OTP a eduardosiaga@gmail.com
// Ejecutar con: node test-otp.js

async function testOTP() {
  console.log('🚀 Iniciando prueba de OTP...\n');
  
  const email = 'eduardosiaga@gmail.com';
  const apiUrl = 'http://localhost:3000/api/auth/test-otp';
  
  try {
    // 1. Solicitar OTP
    console.log(`📧 Enviando solicitud de OTP para: ${email}`);
    console.log(`🔗 URL: ${apiUrl}\n`);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });
    
    const data = await response.json();
    
    console.log('📬 Respuesta del servidor:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(data, null, 2));
    
    if (response.ok && data.testOTP) {
      console.log('\n✅ OTP generado exitosamente!');
      console.log('━'.repeat(50));
      console.log(`🔑 OTP de prueba: ${data.testOTP}`);
      console.log('━'.repeat(50));
      console.log(`⏰ Expira en: ${data.expiresIn} minutos`);
      console.log('\n📝 Nota: Este OTP se muestra solo en modo desarrollo');
      console.log('En producción, el OTP se enviará por email.');
      
      // 2. Mostrar instrucciones para verificar OTP
      console.log('\n📋 Para verificar el OTP:');
      console.log('1. Ve a http://localhost:3000/login');
      console.log(`2. Ingresa el email: ${email}`);
      console.log('3. Haz clic en "Continuar"');
      console.log('4. En la página de verificación, ingresa el OTP mostrado arriba');
      
      // 3. Opcionalmente, verificar el OTP automáticamente
      console.log('\n🔄 ¿Deseas verificar el OTP automáticamente? (Esperando 3 segundos...)');
      
      setTimeout(async () => {
        console.log('\n🔐 Verificando OTP automáticamente...');
        const verifyUrl = 'http://localhost:3000/api/auth/test-verify';
        
        const verifyResponse = await fetch(verifyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            otp: data.testOTP,
            rememberMe: false
          })
        });
        
        const verifyData = await verifyResponse.json();
        
        if (verifyResponse.ok) {
          console.log('\n🎉 ¡Verificación exitosa!');
          console.log('Usuario autenticado:', verifyData.user);
          console.log('\n🔑 Tokens de sesión generados:');
          console.log('- Access Token (15 min):', verifyData.session.accessToken.substring(0, 50) + '...');
          console.log('- Refresh Token (7 días):', verifyData.session.refreshToken.substring(0, 50) + '...');
        } else {
          console.log('\n❌ Error en verificación:', verifyData.error);
        }
      }, 3000);
      
    } else if (data.error) {
      console.log('\n❌ Error:', data.error);
      if (data.blockedUntil) {
        console.log(`🚫 Bloqueado hasta: ${new Date(data.blockedUntil).toLocaleString()}`);
      }
    } else {
      console.log('\n⚠️ Respuesta inesperada del servidor');
    }
    
  } catch (error) {
    console.error('\n❌ Error de conexión:', error.message);
    console.log('\n💡 Sugerencias:');
    console.log('1. Verifica que el servidor esté ejecutándose (npm run dev)');
    console.log('2. Verifica que el puerto 3000 esté disponible');
    console.log('3. Verifica la configuración de la base de datos en .env.local');
  }
}

// Ejecutar la prueba
console.log('═'.repeat(60));
console.log('       TEST DE AUTENTICACIÓN OTP - ESP32 ALARM SYSTEM');
console.log('═'.repeat(60));
console.log();

testOTP().catch(console.error);