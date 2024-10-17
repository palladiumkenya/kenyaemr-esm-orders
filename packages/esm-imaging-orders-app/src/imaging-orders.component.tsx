import React from 'react';
import { ImagingPageHeader } from './header/imagining-header.component';
import { ImagingTabs } from './imaging-tabs/imaging-tabs.component';

const ImagingOrders: React.FC = () => {
  return (
    <div>
      <ImagingPageHeader />
      <ImagingTabs />
    </div>
  );
};

export default ImagingOrders;
