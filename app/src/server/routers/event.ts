import { z } from 'zod';
import { router, tenantProcedure } from '../trpc';

export const eventRouter = router({
  list: tenantProcedure.query(async ({ ctx }) => {
    return ctx.prisma.event.findMany({
      where: { tenantId: ctx.tenantId },
      orderBy: { loadInTime: 'desc' },
    });
  }),
  
  getMonthView: tenantProcedure
    .input(z.object({ year: z.number(), month: z.number() }))
    .query(async ({ ctx }) => {
      return [];
    }),
});
