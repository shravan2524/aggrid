import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import classNames from 'classnames';
import CustomButton from 'components/CustomButton';
import { GstinsType } from 'services/gstinsAPIService';
import { CredentialsType, putGstinCredentialsData } from 'services/credentialsAPIService';
import { toast } from 'react-hot-toast';
import { hideModal } from 'app/utils/Modal';
import { yupEmptyCharsRule } from 'app/utils/YupRules';

interface GstinEditFormProps {
  username: string;
  password: string;
  current_password: string;
}

interface GstinEditCredentialsFormProps {
  gstinData: GstinsType | null;
  gstinCredentials: CredentialsType | null;
  modalId: string;
}
export default function GstinEditCredentialsForm({
  modalId, gstinData, gstinCredentials,
}: GstinEditCredentialsFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPassword, setcurrentPassword] = useState('');
  const schema = yup.object({
    username: yup.string().required().test(yupEmptyCharsRule),
    password: yup.string()
    .required().test(yupEmptyCharsRule)
    .test('passwords-match', 'Old and new password should not be same', (value) => (currentPassword !== value)),
    current_password: yup.string().required().test(yupEmptyCharsRule),
  }).required();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GstinEditFormProps>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (gstinCredentials) {
      reset({ username: gstinCredentials.credentials.username });
    }
  }, [gstinCredentials]);

  const onSubmit = ({ username, password, current_password }: GstinEditFormProps) => {
    setIsLoading(true);
    putGstinCredentialsData(gstinData?.id, gstinCredentials?.id, { username, password, current_password })
      .then((r) => {
        console.log(r);
        toast.success('Gstin credentials successfully updated.');
        setIsLoading(false);
        hideModal(modalId);
        reset({ current_password: '', password: '' });
      })
      .catch(() => {
        toast.error('Wrong password.');
        setIsLoading(false);
      }).finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="modal-header">
        <h5 className="modal-title" id={`new${modalId}Label`}>Edit Gstin Credentials</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
      </div>
      <div className="modal-body">
        <div className="mb-3">
          <label htmlFor="customer" className="col-form-label">
            Gstin:
            {gstinData?.name}
          </label>
        </div>

        <div className="mb-3">
          <label htmlFor="username" className="col-form-label">Username:</label>
          <input
            {...register('username')}
            id="username"
            className={classNames(['form-control form-control-sm', { 'is-invalid': errors.username }])}
            placeholder="Enter Credentials username ..."
          />
          {errors.username && (
            <div id="validationTitleFeedback" className="invalid-feedback">
              <p>{errors.username?.message}</p>
            </div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="current_password" className="col-form-label">Current Password:</label>
          <input
            {...register('current_password')}
            id="current_password"
            type="current_password"
            className={classNames(['form-control form-control-sm', { 'is-invalid': errors.current_password }])}
            placeholder="Enter Credentials current password ..."
            onChange={(e) => setcurrentPassword(e.target.value)}
          />
          {errors.current_password && (
            <div id="validationCurrentPasswordFeedback" className="invalid-feedback">
              <p>{errors.current_password?.message}</p>
            </div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="col-form-label">New Password:</label>
          <input
            {...register('password')}
            id="password"
            type="password"
            className={classNames(['form-control form-control-sm', { 'is-invalid': errors.password }])}
            placeholder="Enter Credentials new password ..."
          />
          {errors.password && (
            <div id="validationTitleFeedback" className="invalid-feedback">
              <p>{errors.password?.message}</p>
            </div>
          )}
        </div>

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
          Update Gstin Credentials
        </CustomButton>
      </div>
    </form>
  );
}
