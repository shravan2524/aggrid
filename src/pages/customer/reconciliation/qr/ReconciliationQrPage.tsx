import React, { useEffect } from 'react';
import PageTitle from 'components/PageTitle';
import { fetchQRData } from 'services/qrAPIService';

export default function ReconciliationQrPage() {
  useEffect(() => {
    fetchQRData().then((qrData) => {
      console.log(qrData);
    });
  }, []);

  return (
    <div className="container">
      <PageTitle title="Reconciliation" />
      <h1>Reconciliation QR Page</h1>
    </div>
  );
}
