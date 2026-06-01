// Arquivo de diagnóstico para debugar problemas com Firebase
export const debugFirebase = () => {
  console.log('='.repeat(60));
  console.log('🔍 DIAGNÓSTICO FIREBASE');
  console.log('='.repeat(60));
  
  // 1. Informações do ambiente
  console.log('\n📍 AMBIENTE:');
  console.log('URL atual:', window.location.href);
  console.log('Hostname:', window.location.hostname);
  console.log('Protocol:', window.location.protocol);
  
  // 2. Verificar localStorage
  console.log('\n💾 LOCALSTORAGE:');
  console.log('teaxis_auth_token:', localStorage.getItem('teaxis_auth_token') ? '✅ Presente' : '❌ Ausente');
  console.log('teaxis_role:', localStorage.getItem('teaxis_role'));
  console.log('user_email:', localStorage.getItem('user_email'));
  console.log('login_method:', localStorage.getItem('login_method'));
  
  // 3. Verificar if está usando HTTPS (necessário para OAuth)
  console.log('\n🔒 SEGURANÇA:');
  const isHttps = window.location.protocol === 'https:';
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  console.log('HTTPS:', isHttps ? '✅ Sim' : '❌ Não (necessário para OAuth!)');
  console.log('Localhost:', isLocalhost ? '✅ Sim (desenvolvimento)' : '❌ Domínio externo');
  
  if (!isHttps && !isLocalhost) {
    console.warn('⚠️ AVISO: OAuth requer HTTPS em domínios externos!');
  }
  
  // 4. Verificar Firebase config
  console.log('\n🔧 FIREBASE CONFIG:');
  console.log('apiKey: AIzaSyBiztuOiweQqp3zhO29pbidEA_biLYstSU');
  console.log('authDomain: teaxis.firebaseapp.com');
  console.log('projectId: teaxis');
  
  // 5. Sugestões
  console.log('\n💡 CHECKLIST:');
  console.log('☐ 1. Abra Firebase Console (https://console.firebase.google.com)');
  console.log('☐ 2. Vá para: Projeto "teaxis" → Authentication → Google');
  console.log('☐ 3. Verifique se seu domínio está em "Authorized domains":');
  console.log('     - localhost');
  if (window.location.hostname !== 'localhost') {
    console.log('     -', window.location.hostname);
  }
  console.log('☐ 4. Se usar Vercel: adicione seu domínio Vercel');
  console.log('☐ 5. Deixe pelo menos 10 minutos após adicionar domínios');
  console.log('☐ 6. Limpe cache do navegador (Ctrl+Shift+Del)');
  console.log('☐ 7. Tente novamente');
  
  console.log('\n' + '='.repeat(60));
};

// Executar automaticamente quando o módulo carregar
if (typeof window !== 'undefined') {
  debugFirebase();
}
