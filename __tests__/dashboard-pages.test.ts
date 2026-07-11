import { describe, expect, it } from '@jest/globals';

import UsersPage from '../app/dashboard/users/page';
import OrdersPage from '../app/dashboard/orders/page';
import SettingsPage from '../app/dashboard/settings/page';

describe('dashboard pages', () => {
  it('exports working dashboard page components', () => {
    expect(typeof UsersPage).toBe('function');
    expect(typeof OrdersPage).toBe('function');
    expect(typeof SettingsPage).toBe('function');
  });
});
