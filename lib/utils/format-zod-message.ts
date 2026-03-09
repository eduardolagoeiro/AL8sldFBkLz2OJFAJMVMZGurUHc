export function formatZodMessage(error: { issues?: { message?: string }[] }) {
  return error.issues?.[0]?.message ?? 'Dados inválidos';
}
