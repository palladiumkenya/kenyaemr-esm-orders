import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ImagingOrders from './imaging-orders.component';
import { WorkspaceContainer } from '@openmrs/esm-framework';

const Root: React.FC = () => {
  const baseName = window.getOpenmrsSpaBase() + 'home/imaging-orders';

  return (
    <BrowserRouter basename={baseName}>
      <Routes>
        <Route path="/" element={<ImagingOrders />} />
        <Route path="/:patientUuid" element={<ImagingOrders />} />
      </Routes>
      <WorkspaceContainer contextKey="imaging-orders" />
    </BrowserRouter>
  );
};

export default Root;
