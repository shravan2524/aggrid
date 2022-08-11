import React, {
  useEffect, useMemo, useState,
} from 'react';
import { GstinsType } from 'services/gstinsAPIService';
import { CredentialsType, fetchGstinCredentialsData } from 'services/credentialsAPIService';
import GstinEditCredentialsForm from './GstinEditCredentialsForm';
import GstinNewCredentialsForm from './GstinNewCredentialsForm';

interface EditGstinCredentialsModalProps {
  gstinData: GstinsType | null;
}
export default function GstinCredentialsModal({ gstinData }: EditGstinCredentialsModalProps) {
  const [gstinCredentials, setGstinCredentials] = useState<CredentialsType | null>(null);
  const modalId = useMemo(() => 'editCredentialsGstinModal', []);

  useEffect(() => {
    if (gstinData) {
      fetchGstinCredentialsData(gstinData?.id).then((res) => {
        setGstinCredentials(res);
      }).catch((e) => {
        setGstinCredentials(null);
      });
    }
  }, [gstinData]);

  return (
    <div className="modal fade" id={modalId} aria-labelledby={`new${modalId}Label`} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          {
            gstinCredentials
              ? <GstinEditCredentialsForm gstinData={gstinData} gstinCredentials={gstinCredentials} modalId={modalId} />
              : <GstinNewCredentialsForm gstinData={gstinData} modalId={modalId} />
          }
        </div>
      </div>
    </div>
  );
}
