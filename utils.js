/**
 * Veirifica se o erro é um erro padrão da aplicação
 */
export function errorVerifier(error) {
  if(typeof error === 'object' &&
    error.hasOwnProperty('message') &&
    error.hasOwnProperty('error')) {
    return true;
  }

  return false;
}