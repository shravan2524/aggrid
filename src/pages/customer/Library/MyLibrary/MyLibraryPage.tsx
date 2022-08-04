import PageWrapper from 'components/PageWrapper';
import React, { useEffect, useState } from 'react';
import FilesComponent from 'components/Library/FilesComponent';
import 'components/Library/style.scss';
import { showModal } from 'app/utils/Modal';
import { fetchFoldersData, Folders } from 'services/FolderAPIService';
import SaveFolderModal from 'components/Library/CreateFolder';
import MyFilters from './MyFilters';

const moduleTitle = 'My Library';

function MyLibraryPage() {
  const [folder, setFolders] = useState<Folders[]>();
  const [itemData, setItemData] = useState<Folders | null>(null);

  useEffect(() => {
    fetchFoldersData().then((data) => {
      setFolders(data);
    });
  }, []);

  return (
    <PageWrapper pageTitle={moduleTitle} icon="fas fa-folder-open">
      <div className="mai-div">
        <SaveFolderModal itemData={itemData} setFolders={setFolders} setItemData={setItemData} />
        <div className="d-flex px-2 py-2 justify-content-between align-items-center w-100 gap-2">
          <p>Folders</p>
          <button
            onClick={() => showModal('saveFolderModal')}
            type="button"
            className="btn btn-success gap-2 btn-sm d-flex justify-content-center align-items-center"
          >
            <i className="fas fa-folder-plus" />
            Create Folder
          </button>
        </div>
        <div className="row row-cols-6">
          {folder
          && folder.map((f, i) => (
            <FilesComponent key={i} f={f} setItemData={setItemData} />
            ))}
        </div>
        {/* filters */}
        <div className="d-flex px-2 py-2 justify-content-between align-items-center w-100 gap-2">
          <p>Files</p>
        </div>
        <MyFilters />
      </div>
    </PageWrapper>
  );
}
export default React.memo(MyLibraryPage);
