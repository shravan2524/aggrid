import React, { useEffect, useState } from 'react';
import PageTitle from 'components/PageTitle';
import { fetchCompaniesData } from 'services/companiesAPIService';

export default function CompaniesPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchCompaniesData().then((companiesData) => {
      console.log(companiesData);

      setData(companiesData);
    });
  }, []);

  return (
    <div className="container">
      <PageTitle title="Companies" />
      <h1>Companies Page</h1>
    </div>
  );
}
