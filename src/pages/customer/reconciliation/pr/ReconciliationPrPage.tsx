import React, { useEffect } from 'react';
import PageTitle from 'components/PageTitle';
import { fetchPRData } from 'services/prAPIService';

export default function ReconciliationPrPage() {
  useEffect(() => {
    fetchPRData().then((qrData) => {
      console.log(qrData);
    });
  }, []);

  return (
    <div className="container">
      <PageTitle title="Reconciliation" />
      <h1>Reconciliation PR Page</h1>
    </div>
  );
}
