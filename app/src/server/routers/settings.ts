import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

export const settingsRouter = router({
  list: tenantProcedure.query(async ({ ctx }) => {
    // TODO: Implement settings router
    return [];
  }),
});
