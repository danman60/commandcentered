import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

export const shiftRouter = router({
  list: tenantProcedure.query(async ({ ctx }) => {
    // TODO: Implement shift router
    return [];
  }),
});
