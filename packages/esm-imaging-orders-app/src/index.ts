import { getAsyncLifecycle, defineConfigSchema, getSyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import { createLeftPanelLink } from './left-panel-link';
import addRadiologyToWorklistDialog from './imaging-tabs/test-ordered/pick-radiology-order/add-to-worklist-dialog.component';
import rejectOrderDialogComponent from './imaging-tabs/test-ordered/reject-order-dialog/reject-order-dialog.component';
import radiologyInstructionsModal from './imaging-tabs/test-ordered/radiology-instructions/radiology-instructions.component';
import ReviewOrderDialog from './imaging-tabs/review-ordered/review-radiology-report-dialog/review-radiology-report-dialog.component';
import RadiologyOrderBasketPanelExtension from './form/radiology-orders/radiology-order-basket-panel/radiology-order-basket-panel.extension';
import radiologyRejectReasonModal from './imaging-tabs/test-ordered/reject-order-dialog/radiology-reject-reason.component';
import { moduleName } from './constants';
import Root from './root.component';
import ImagingReportForm from './results/result-form.component';

const options = {
  featureName: 'esm-imaging-orders-app',
  moduleName,
};

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

export const root = getSyncLifecycle(Root, options);

export const imagingOrdersLink = getSyncLifecycle(
  createLeftPanelLink({
    name: 'imaging-orders',
    title: 'Imaging Orders',
  }),
  options,
);

export const addRadiologyToWorklistDialogComponent = getSyncLifecycle(addRadiologyToWorklistDialog, options);

// Modals
export const rejectOrderDialog = getSyncLifecycle(rejectOrderDialogComponent, options);
export const radiologyInstructionsModalComponent = getSyncLifecycle(radiologyInstructionsModal, options);
export const reviewRadiologyReportDialog = getSyncLifecycle(ReviewOrderDialog, options);

export const radiologyOrderPanel = getSyncLifecycle(RadiologyOrderBasketPanelExtension, options);
export const radiologyRejectReasonModalComponent = getSyncLifecycle(radiologyRejectReasonModal, options);

// t('addRadiologyOrderWorkspaceTitle', 'Add Radiology order')
export const addRadiologyOrderWorkspace = getAsyncLifecycle(
  () => import('./form/radiology-orders/add-radiology-order/add-radiology-order.workspace'),
  options,
);

export const imagingReportForm = getSyncLifecycle(ImagingReportForm, options);
