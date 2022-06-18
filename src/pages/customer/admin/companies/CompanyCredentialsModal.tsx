import React, {
  useEffect, useMemo, useState,
} from 'react';
import { CompaniesType } from 'services/companiesAPIService';
import { CredentialsType, fetchCompanyCredentialsData } from 'services/credentialsAPIService';
import CompanyEditCredentialsForm from './CompanyEditCredentialsForm';
import CompanyNewCredentialsForm from './CompanyNewCredentialsForm';

interface EditCompanyCredentialsModalProps {
  companyData: CompaniesType | null;
}
export default function CompanyCredentialsModal({ companyData }: EditCompanyCredentialsModalProps) {
  const [companyCredentials, setCompanyCredentials] = useState<CredentialsType | null>(null);
  const modalId = useMemo(() => 'editCredentialsCompanyModal', []);

  useEffect(() => {
    if (companyData) {
      fetchCompanyCredentialsData(companyData?.id).then((res) => {
        setCompanyCredentials(res);
      }).catch((e) => {
        setCompanyCredentials(null);
      });
    }
  }, [companyData]);

  return (
    <div className="modal fade" id={modalId} aria-labelledby={`new${modalId}Label`} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          {
            companyCredentials
              ? <CompanyEditCredentialsForm companyData={companyData} companyCredentials={companyCredentials} modalId={modalId} />
              : <CompanyNewCredentialsForm companyData={companyData} modalId={modalId} />
          }
        </div>
      </div>
    </div>
  );
}
