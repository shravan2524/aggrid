import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import PageTitle from 'components/PageTitle';
import { tenantUuid } from 'state/tenants/helper';
import { BACKEND_API } from 'app/config';

export default function ProfilePage() {
  const [userDetails, setuserDetails] = useState<any>({});
  useEffect(() => {
    const options: RequestInit = {
      method: 'GET',
      credentials: 'include',
    };
    const apiUrl = `${BACKEND_API}/api/v1/me/`;
    fetch(apiUrl, options)
      .then((response) => response.json())
      .then((data) => setuserDetails(data));
  }, []);
  return (
    <>
      <PageTitle title="Profile" />
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-4">
            <div className="card mb-4">
              <div className="card-body text-center">
                <img src={userDetails.picture} alt="avatar" className="rounded-circle img-fluid" />
                <h5 className="my-3">{userDetails.name}</h5>
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-3">
                    <p className="mb-0">Full Name</p>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">{userDetails.name}</p>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <p className="mb-0">Email</p>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">{userDetails.email}</p>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <p className="mb-0">NickName</p>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">{userDetails.nickname}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
