import { formatPrice } from '../app/lib/format';

describe('formatPrice', () => {
  it('formats values as FCFA without decimals', () => {
    expect(formatPrice(32499)).toBe('32 499 FCFA');
    expect(formatPrice('54999')).toBe('54 999 FCFA');
  });
});
