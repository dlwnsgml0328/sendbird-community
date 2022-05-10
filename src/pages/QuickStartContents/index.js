import React from 'react';
import SendBirdApp from '@sendbird/uikit-react/App';
import { APP_ID, NICKNAME, USER_ID } from '../../config/const';

const QuickStartContents = () => {
  return (
    <div>
      <div className="App" style={{ height: '95vh' }}>
        <SendBirdApp
          // Add the two lines below.
          appId={APP_ID} // Specify your Sendbird application ID.
          userId={USER_ID} // Specify your user ID.
          nickname={NICKNAME}
        />
      </div>
    </div>
  );
};

export default QuickStartContents;
