import FilesComponent from 'components/Library/FilesComponent';
import ShareDataModal from 'components/Library/SharePopup';
import PageWrapper from 'components/PageWrapper';
import React from 'react';
import { FakeData } from '../MyLibrary/FakeData';

const moduleTitle = 'Shared';

function SharedWithMe() {
  return (
    <PageWrapper pageTitle={moduleTitle} icon="fas fa-user-friends">
      <div className="mai-div">
        <ShareDataModal active />
        {FakeData.slice(0, 1).map((f, i) => (
          <FilesComponent f={f} i={i} />
        ))}
      </div>
    </PageWrapper>
  );
}
export default React.memo(SharedWithMe);
