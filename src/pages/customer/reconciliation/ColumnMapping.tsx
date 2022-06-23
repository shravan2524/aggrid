import React, { useEffect, useMemo, useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'app/hooks';
import CustomButton from 'components/CustomButton';
import { getSelectedTenant } from 'state/tenants/tenantsSlice';
import './ColumnMapping.scss';
import {
  fetchCompanies,
  getCompanies,
  isPostLoadingSelector,
  newCompanyRequest,
} from 'state/companies/companiesSlice';
import { hideModal, initBootstrapModal } from 'app/utils/Modal';
import { Column } from 'ag-grid-community';

interface NewProps {
  contentType: string;
}

interface NewCompanyFormProps {
  name: string;
  customer_id: number | undefined;
  parent: number | undefined;
}

function Columnlist() {
  const [contentTypeselect, setcontentTypeselect] = useState([
    {
      columnName: '2A : a',
      selected: 0,
    },
    {
      columnName: '2A : b',
      selected: 0,
    },
    {
      columnName: '2A : c',
      selected: 0,
    },
    {
      columnName: '2A : d',
      selected: 0,
    },
    {
      columnName: '2A : e',
      selected: 0,
    },
    {
      columnName: '2A : f',
      selected: 0,
    },
    {
      columnName: '2A : g',
      selected: 0,
    },
  ]);
  const [test, settest] = useState(true);

  const arr = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  ];
  function onchange(index, e) {
    const tempcontentTypeselect = contentTypeselect;
    const ind = tempcontentTypeselect.findIndex((v) => v.columnName === e.target.value);
    tempcontentTypeselect[ind].selected = index + 1;
    setcontentTypeselect(tempcontentTypeselect);
    settest(!test);
  }
  return (
    <div>
      {
        arr.map((ee, ind) => (
          <table key={ind}>
            <tr>
              <th>
                <div>
                  <span>Seller Gstin</span>
                  <select onChange={(e1) => onchange(ind, e1)}>
                    <option>Column Mapping : </option>
                    {
                      contentTypeselect.map((e) => (
                        (e.selected === (ind + 1) || !e.selected)
                          ? <option key={e.columnName}>{e.columnName}</option>
                          : null
                      ))
                    }
                  </select>
                </div>
              </th>
            </tr>
            <tr>
              <td>3718AJBD18BAJD</td>
            </tr>
            <tr>
              <td>25472HGAGDH1812</td>
            </tr>
            <tr>
              <td>127AKDH1828BD11</td>
            </tr>
            <tr>
              <td>25472HGAGDH1812</td>
            </tr>
          </table>
        ))

      }

    </div>
  );
}

export default function ColumnMapping() {
  const dispatch = useAppDispatch();
  const isLoading = useSelector(isPostLoadingSelector);
  const selectedCustomer = useSelector(getSelectedTenant);
  const companySelector = useSelector(getCompanies);
  const modalId = useMemo(() => 'newCompanyModal', []);
  const schema = yup.object({
    name: yup.string().required(),
    customer_id: yup.string().required(),
    parent: yup.string(),
  }).required();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewCompanyFormProps>({
    resolver: yupResolver(schema),
  });

  const onSubmit = ({ name, customer_id, parent }: NewCompanyFormProps) => {
    const body = {
      name,
      customer_id: Number(customer_id),
      parent: Number(parent),
    };
    dispatch(newCompanyRequest(body));
  };

  useEffect(() => {
    reset({ customer_id: selectedCustomer?.id });
  }, [selectedCustomer]);

  useEffect(() => {
    initBootstrapModal(modalId);
  }, []);

  useEffect(() => {
    hideModal(modalId);
    reset({ name: '' });
    dispatch(fetchCompanies());
  }, [isLoading]);
  return (
    <div className="modal fade" id={modalId} aria-labelledby={`new${modalId}Label`} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-header">
              <h5 className="modal-title" id={`new${modalId}Label`}>Column Mapping</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <Columnlist />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-sm btn-danger" data-bs-dismiss="modal">
                Close
              </button>
              <CustomButton
                isLoading={isLoading}
                isSubmit
                className="btn btn-sm btn-primary"
              >
                Save
              </CustomButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
