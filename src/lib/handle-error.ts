export const getErrorMessage = (error: unknown): string => {
  let message: string;

  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = String((error as { message: unknown }).message);
  } else if (typeof error === 'string') {
    message = error;
  } else {
    message = 'Ocurrió un error inesperado.';
  }

  return message;
}; 