import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'app/hooks';
import { getSelectedCustomer } from 'state/customers/customersSlice';
import { CompaniesType } from 'services/companiesAPIService';
import { CredentialsType, fetchCompanyCredentialsData } from 'services/credentialsAPIService';
import CompanyEditCredentialsForm from './CompanyEditCredentialsForm';
import CompanyNewCredentialsForm from './CompanyNewCredentialsForm';

interface EditCompanyFormProps {
  username: string;
  password: string;
}

interface EditCompanyCredentialsModalProps {
  companyData: CompaniesType | null;
}
export default function CompanyCredentialsModal({ companyData }: EditCompanyCredentialsModalProps) {
  const dispatch = useAppDispatch();
  const isLoading = false;
  const selectedCustomer = useSelector(getSelectedCustomer);

  const [companyCredentials, setCompanyCredentials] = useState<CredentialsType | null>(null);

  const modalId = useMemo(() => 'editCredentialsCompanyModal', []);

  const onModalClose = useCallback(() => {

  }, []);

  const schema = yup.object({
    username: yup.string().required(),
    password: yup.string().required(),
  }).required();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditCompanyFormProps>({
    resolver: yupResolver(schema),
  });

  const onSubmit = ({ username, password }: EditCompanyFormProps) => {
    const payload = { data: { username, password }, id: companyData?.id };
    // dispatch(updateCompanyRequest({ ...payload }));
  };

  useEffect(() => {
    if (companyData) {
      fetchCompanyCredentialsData(companyData?.id).then((res) => {
        console.log(res);

        setCompanyCredentials(res);
        reset({ username: res.credentials.username });
      }).catch((e) => {
        console.log('Here');
        setCompanyCredentials(null);
        reset({ username: '' });
      });
    }
  }, [companyData]);

  return (
    <div className="modal fade" id={modalId} aria-labelledby={`new${modalId}Label`} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          {
            companyCredentials
              ? <CompanyEditCredentialsForm companyData={companyData} companyCredentials={companyCredentials} modalId={modalId} isLoading={isLoading} />
              : <CompanyNewCredentialsForm companyData={companyData} modalId={modalId} isLoading={isLoading} />
          }
        </div>
      </div>
    </div>
  );
}
