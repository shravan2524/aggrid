import PageWrapper from 'components/PageWrapper';
import React from 'react';
import FilesComponent from 'components/Library/FilesComponent';
import ShareDataModal from 'components/Library/SharePopup';
import { FakeData } from './FakeData';
import 'components/Library/style.scss';

const moduleTitle = 'My Library';

function MyLibraryPage() {
  return (
    <PageWrapper pageTitle={moduleTitle} icon="fas fa-folder-open">
      <div className="mai-div">
        <ShareDataModal active />
        {FakeData.map((f, i) => (
          <FilesComponent f={f} i={i} />
        ))}
      </div>
    </PageWrapper>
  );
}
export default React.memo(MyLibraryPage);