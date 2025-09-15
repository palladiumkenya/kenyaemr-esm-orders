import Root from './root.component';
import { moduleName } from './constants';
import { configSchema } from './config-schema';

import { defineConfigSchema, getSyncLifecycle } from '@openmrs/esm-framework';
import { createLeftPanelLink } from './left-panel-link';
import RejectImagingOrderModal from './imaging-tabs/test-ordered/reject-order-dialog/reject-order-dialog.component';
import ImagingReportForm from './form/imaging-report-form/imaging-report-form.component';
import AddImagingOrderWorkspace from './form/imaging-orders/add-imaging-orders/add-imaging-order.workspace';
import ImagingOrderBasketPanelExtension from './form/imaging-orders/imaging-order-basket-panel/imaging-order-basket-panel.extension';
import AddImagingToWorkListModal from './imaging-tabs/test-ordered/pick-imaging-order/add-to-worklist-dialog.component';
import AmendModal from './imaging-tabs/test-ordered/amend-order-dialog/amend-imaging-dialog.component';
import ImagingReviewForm from './form/review-form/review-imaging-form.workspace';
import PrintPreviewModal from './print/print-report-modal.component';
import SearchPatientWorkspace from './form/imaging-orders/search-patient.workspace';
import ImagingOrders from './imaging-orders.component';

const options = {
  featureName: 'esm-imaging-orders-app',
  moduleName,
};

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

export const root = getSyncLifecycle(Root, options);
export const radiologyDashboard = getSyncLifecycle(ImagingOrders, options);

// t('radiologyAndImaging', 'Radiology and Imaging')
export const imagingOrdersLink = getSyncLifecycle(
  createLeftPanelLink({
    name: 'imaging-orders',
    title: 'Radiology and Imaging',
  }),
  options,
);

// Modals

export const imagingOrderPanel = getSyncLifecycle(ImagingOrderBasketPanelExtension, options);
export const rejectImagingOrderModal = getSyncLifecycle(RejectImagingOrderModal, options);
export const printReportModal = getSyncLifecycle(PrintPreviewModal, options);

// t('addImagingOrderWorkspaceTitle', 'Add Imaging order')
export const addImagingOrderWorkspace = getSyncLifecycle(AddImagingOrderWorkspace, options);
export const searchPatientWorkspace = getSyncLifecycle(SearchPatientWorkspace, options);

export const imagingReportForm = getSyncLifecycle(ImagingReportForm, options);
export const imagingReviewForm = getSyncLifecycle(ImagingReviewForm, options);
export const addImagingToWorkListModal = getSyncLifecycle(AddImagingToWorkListModal, options);
export const amendModal = getSyncLifecycle(AmendModal, options);
