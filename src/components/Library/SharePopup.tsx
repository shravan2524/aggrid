import React from 'react';
import './style.scss';
import { UsersDatas } from './Users';

interface Props {
  active: boolean;
}

export default function ShareDataModal({ active }: Props) {
  const modalId = 'shareDataModal';
  return (
    <div
      className="modal fade"
      id={modalId}
      aria-labelledby={`new${modalId}Label`}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={`new${modalId}Label`}>
              Share Data
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <form>
            <div className="modal-body">
              {!active && (
                <div className="mb-4 w-100">
                  <input
                    type="text"
                    className=" w-100 inputed rounded-top"
                    placeholder="Data title"
                  />
                </div>
              )}

              <div className="mb-4 w-100">
                <input
                  type="email"
                  className=" w-100 inputed rounded-top"
                  placeholder="Add user email"
                />
              </div>
              <div className="mb-4 w-100">
                <textarea
                  rows={2}
                  className=" w-100 border-0 bg-light p-4 rounded-2"
                  placeholder="Message"
                />
              </div>
              {/* acess people */}
              {active && (
                <>
                  <h5>People with access</h5>
                  {UsersDatas.map((u, i) => (
                    <div
                      key={i}
                      className="p-2 mb-1 hover-user rounded-pill d-flex justify-content-between align-items-center gap-2"
                    >
                      <div className="w-75 d-flex gap-2 align-items-center">
                        <div className="user d-flex justify-content-center align-items-center rounded-circle">
                          <i className="fas fa-user-circle" />
                        </div>
                        <p>{u.email}</p>
                      </div>
                      <div className="w-25 px-2 d-flex justify-content-end align-items-center">
                        {u.status === 'owner' ? (
                          <p>
                            (
                            <span className="fw-semibold">owner</span>
                            )
                          </p>
                        ) : (
                          <button type="button" className="btn btn-light">
                            <i className="fas fa-trash-alt text-danger" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-md btn-primary d-flex gap-3 justify-content-center align-items-center"
              >
                Share
                <i className="fas fa-paper-plane" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
