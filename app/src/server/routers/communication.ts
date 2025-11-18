import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

export const communicationRouter = router({
  list: tenantProcedure.query(async ({ ctx }) => {
    // TODO: Implement communication router
    return [];
  }),
});
