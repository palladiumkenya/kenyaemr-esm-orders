import { getAsyncLifecycle, defineConfigSchema, getSyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import { moduleName } from './constants';
import dispensingComponent from './medicalsupplydispensing.component';
import dispensingLinkComponent from './dispensing-link.component';
import dispensingDashboardComponent from './dashboard/dispensing-dashboard.component';
import dispensingLinkHomepageComponent from './dashboard/dispensing-dashboard-link.component';

const options = {
  featureName: 'esm-medical-supply-dispensing-app',
  moduleName,
};

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

export const dispensing = getSyncLifecycle(dispensingComponent, options);

export const medicalSuppliesDispensingLink = getSyncLifecycle(dispensingLinkComponent, options);

export const supplyDispensingDashboard = getSyncLifecycle(dispensingDashboardComponent, options);

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

// export const root = getAsyncLifecycle(() => import('./root.component'), options);

export const dispensingDashboardLink = getSyncLifecycle(dispensingLinkHomepageComponent, options);
