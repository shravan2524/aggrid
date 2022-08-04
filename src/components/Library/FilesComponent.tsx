import { showModal } from 'app/utils/Modal';
import React from 'react';
import { Folders } from 'services/FolderAPIService';

interface Props {
  f: any;
  setItemData: React.Dispatch<React.SetStateAction<Folders | null>>;
}

export default function FilesComponent({ f, setItemData }: Props) {
  return (
    <div className="col p-3">
      <div className="box bg-light rounded-2">
        <div className="w-100 box1 d-flex gap-4 align-items-center">
          <i className="fas fa-folder" />
          <p className="text-xs">{f.title}</p>
        </div>
        {/* actions */}
        <div className="actions px-2 bg-light h-100 d-flex justify-content-between align-items-center w-100 gap-2">
          <button
            type="button"
            className="action-button d-flex justify-content-center align-items-center"
          >
            <i className="far fa-eye" />
          </button>
          <button
            type="button"
            className="action-button d-flex justify-content-center align-items-center"
          >
            <i className="fas fa-trash-alt" />
          </button>
          <button
            onClick={() => {
              showModal('saveFolderModal');
              setItemData(f);
            }}
            type="button"
            className="action-button d-flex justify-content-center align-items-center"
          >
            <i className="far fa-edit" />
          </button>
        </div>
      </div>
    </div>
  );
}
