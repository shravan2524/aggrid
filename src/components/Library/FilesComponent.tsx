import { showModal } from 'app/utils/Modal';
import React from 'react';

interface Props {
  i: number;
  f: any;
}

export default function FilesComponent({ i, f }: Props) {
  return (
    <div key={i} className="d-flex w-100 px-5 py-4 mb-2">
      <div className="w-25">
        <h5>{f.date}</h5>
      </div>
      <div className="row w-75 row-cols-4 align-items-center">
        {f.datas.map((d, index) => (
          <div className="col p-2" key={index}>
            <div className="box bg-light rounded-2">
              <div className="w-100 box1 d-flex justify-content-center align-items-center">
                <i className="fas fa-folder" />
              </div>
              <div className="box2 text-center">
                <h6>{d.name}</h6>
              </div>
              {/* actions */}
              <div className="actions d-flex flex-column gap-2">
                <button
                  type="button"
                  className="action-button d-flex justify-content-center align-items-center"
                >
                  <i className="far fa-eye" />
                </button>
                <button
                  type="button"
                  onClick={() => showModal('shareDataModal')}
                  className="action-button d-flex justify-content-center align-items-center"
                >
                  <i className="fas fa-user-plus" />
                </button>
                <button
                  type="button"
                  className="action-button d-flex justify-content-center align-items-center"
                >
                  <i className="fas fa-trash-alt" />
                </button>
                <button
                  type="button"
                  className="action-button d-flex justify-content-center align-items-center"
                >
                  <i className="far fa-edit" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}