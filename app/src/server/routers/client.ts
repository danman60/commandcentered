import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

export const clientRouter = router({
  list: tenantProcedure.query(async ({ ctx }) => {
    // TODO: Implement client router
    return [];
  }),
});
