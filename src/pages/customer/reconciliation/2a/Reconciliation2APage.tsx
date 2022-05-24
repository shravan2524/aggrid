import React, { useCallback, useEffect, useState } from 'react';
import PageTitle from 'components/PageTitle';
import { fetch2AData } from 'services/2AAPIService';

export default function Reconciliation2APage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch2AData().then((twoAData) => {
      console.log(twoAData);

      setData(twoAData);
    });
  }, []);

  return (
    <div className="container">
      <PageTitle title="Reconciliation" />
      <h1>Reconciliation 2A Page</h1>
    </div>
  );
}
