export function formatPrice(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') {
    return '0 FCFA';
  }

  const numericValue = typeof value === 'number' ? value : Number(value);

  if (Number.isNaN(numericValue)) {
    return '0 FCFA';
  }

  return `${new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
  }).format(numericValue)} FCFA`;
}
