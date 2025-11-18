import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

export const userRouter = router({
  list: tenantProcedure.query(async ({ ctx }) => {
    // TODO: Implement user router
    return [];
  }),
});
