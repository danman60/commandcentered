import { router } from '../trpc';
import { eventRouter } from './event';
import { shiftRouter } from './shift';
import { operatorRouter } from './operator';
import { gearRouter } from './gear';
import { kitRouter } from './kit';
import { leadRouter } from './lead';
import { communicationRouter } from './communication';
import { deliverableRouter } from './deliverable';
import { dashboardRouter } from './dashboard';
import { clientRouter } from './client';
import { reportRouter } from './report';
import { fileRouter } from './file';
import { settingsRouter } from './settings';
import { userRouter } from './user';
import { gearAssignmentRouter } from './gearAssignment';
import { contractRouter } from './contract';
import { proposalRouter } from './proposal';

/**
 * Main tRPC router - 17 routers, ~130 procedures
 *
 * All routers enforce multi-tenant isolation via tenantProcedure
 */
export const appRouter = router({
  event: eventRouter, // 10 procedures
  shift: shiftRouter, // 8 procedures
  operator: operatorRouter, // 6 procedures
  gear: gearRouter, // 7 procedures
  kit: kitRouter, // 7 procedures
  lead: leadRouter, // 8 procedures
  communication: communicationRouter, // 5 procedures
  deliverable: deliverableRouter, // 6 procedures
  dashboard: dashboardRouter, // 9 procedures
  client: clientRouter, // 6 procedures
  report: reportRouter, // 4 procedures
  file: fileRouter, // 8 procedures (6 stubs + 2 integration stubs)
  settings: settingsRouter, // 6 procedures
  user: userRouter, // 8 procedures
  gearAssignment: gearAssignmentRouter, // 4 procedures
  contract: contractRouter, // 6 procedures
  proposal: proposalRouter, // 7 procedures
});

export type AppRouter = typeof appRouter;
