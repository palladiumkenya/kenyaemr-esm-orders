import Root from './root.component';
import { moduleName } from './constants';
import { configSchema } from './config-schema';

import { defineConfigSchema, getSyncLifecycle } from '@openmrs/esm-framework';
import { createLeftPanelLink } from './left-panel-link';
import RejectImagingOrderModal from './imaging-tabs/test-ordered/reject-order-dialog/reject-order-dialog.component';
import ReviewImagingReportModal from './imaging-tabs/review-ordered/review-imaging-report-modal/review-imaging-report-dialog.component';
import ImagingReportForm from './form/imaging-report-form/imaging-report-form.component';
import AddImagingOrderWorkspace from './form/imaging-orders/add-imaging-orders/add-imaging-order.workspace';
import ImagingOrderBasketPanelExtension from './form/imaging-orders/imaging-order-basket-panel/imaging-order-basket-panel.extension';
import AddImagingToWorkListModal from './imaging-tabs/test-ordered/pick-imaging-order/add-to-worklist-dialog.component';

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

// Modals
export const reviewImagingReportModal = getSyncLifecycle(ReviewImagingReportModal, options);

export const imagingOrderPanel = getSyncLifecycle(ImagingOrderBasketPanelExtension, options);
export const rejectImagingOrderModal = getSyncLifecycle(RejectImagingOrderModal, options);

// t('addImagingOrderWorkspaceTitle', 'Add Imaging order')
export const addImagingOrderWorkspace = getSyncLifecycle(AddImagingOrderWorkspace, options);

export const imagingReportForm = getSyncLifecycle(ImagingReportForm, options);
export const addImagingToWorkListModal = getSyncLifecycle(AddImagingToWorkListModal, options);
