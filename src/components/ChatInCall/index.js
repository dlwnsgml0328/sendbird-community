import React, { useState } from 'react';
import styled from 'styled-components';
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';
import withSendBird from '@sendbird/uikit-react/withSendBird';

import { APP_ID } from '../../config/const';
import CreateChannel from '@sendbird/uikit-react/CreateChannel';
import Channel from '@sendbird/uikit-react/Channel';
import ChannelSettings from '@sendbird/uikit-react/ChannelSettings';

const ChatInCall = ({ setIsChat, caller, roomId, info, setInfo, roomCtx }) => {
  const [onCreate, setOnCreate] = useState(false);
  const [onSetting, setOnSetting] = useState(false);

  // useEffect(() => {
  //   console.log('@ roomCtx update in group Chat in GroupCall', roomCtx);
  //   console.log('roomCtx.customItems.key3', roomCtx.customItems.key3);
  // }, [roomCtx]);

  // 방을 만들었을 때 해당 방으로 들어오기
  const onCreateChannel = (res) => {
    if (res.url) {
      setInfo({
        url: res.url,
        members: res.members,
        channelType: res.channelType,
      });
    }
  };

  return (
    <SendbirdProvider appId={APP_ID} userId={caller} nickname={caller}>
      <ChatOverlay>
        <span className="exit" onClick={() => setIsChat(false)}>
          X
        </span>

        <div className="chat_wrap">
          <span>{caller}님 안녕하세요!</span>

          <button onClick={() => setOnCreate(true)}>방 만들기</button>
        </div>

        {onCreate && (
          <CreateChannel
            channelUrl={roomId}
            onCreateChannel={onCreateChannel}
            onCancel={() => setOnCreate(false)}
          />
        )}

        {onSetting && (
          <ChannelSettings
            channelUrl={roomCtx.customItems.key3 || info.url}
            onCloseClick={() => setOnSetting(false)}
          />
        )}

        {info || roomCtx.customItems.key3 ? (
          <Channel
            channelUrl={roomCtx.customItems.key3 || info.url}
            renderChannelHeader={() => (
              <div>
                <button onClick={() => setOnSetting(true)}>채팅방 설정</button>
              </div>
            )}
            style={{ height: '95vh' }}
          />
        ) : (
          <span>no Info</span>
        )}
      </ChatOverlay>
    </SendbirdProvider>
  );
};

const ChatOverlay = styled.div`
  z-index: 9999;
  position: absolute;
  top: 0;

  right: 0;
  width: 30vw;
  height: 100vh;
  background: #fff;
  color: #000;

  button {
    background: #fff;
  }

  .chat_wrap {
    padding: 5%;
  }

  .sendbird-conversation {
    height: 95vh;
  }

  .sendbird-channel-settings {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10000;

    width: 100%;
  }
`;

export default withSendBird(ChatInCall);
