import React, { useEffect, useState } from 'react';
import PageTitle from 'components/PageTitle';
import { fetchCustomersData } from 'services/customersAPIService';

export default function CustomersPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchCustomersData().then((customersData) => {
      console.log(customersData);

      setData(customersData);
    });
  }, []);

  return (
    <div className="container">
      <PageTitle title="Customers" />
      <h1>Customers Page</h1>
    </div>
  );
}
