import React, { useCallback } from 'react';
import styled from 'styled-components';

const DialView = ({
  SendBirdCall,
  callee,
  setCallee,
  setIsCall,
  setCallCtx,
  setCallerTime,
}) => {
  // SendBirdCall.dial 의 파라미터로 넘겨주는 call 의 인터페이스가 DirectCall
  const dial = useCallback(
    (isVideoCall) => {
      SendBirdCall.dial(
        {
          userId: callee,
          isVideoCall: isVideoCall,
          callOption: {
            localMediaView: undefined,
            remoteMediaView: undefined,
            audioEnabled: true,
            videoEnabled: true,
          },
        },
        (call, error) => {
          if (error) {
            console.log('error occured in call', error);
            return;
          }

          let time = 0;

          console.log('success call process: ', call);
          setIsCall(true);
          setCallCtx(call);
          setCallee(callee.nickname);

          call.onEstablished = (call) => {
            console.log('caller onEstablished', call);
          };

          call.onConnected = (call) => {
            console.log('caller onConnected', call);
            call.startVideo();

            time = setInterval(() => {
              // console.log(Math.floor(Number(call.getDuration() / 1000)) + '초');
              setCallerTime(Math.floor(Number(call.getDuration() / 1000)));
            }, [1000]);
          };

          call.onReconnected = (call) => {
            console.log('caller reconnected', call);
          };

          call.onReconnecting = (call) => {
            console.log('caller reconnecting', call);
          };

          call.onEnded = (call) => {
            console.log('caller onEnded', call);
            // caller 전화 상태 끄기
            clearInterval(time);
            setIsCall(false);
          };

          call.onRemoteAudioSettingsChanged = (call) => {
            console.log('caller onRemoteAudioSettingsChanged', call);
          };

          call.onRemoteVideoSettingsChanged = (call) => {
            console.log('caller onRemoteVideoSettingsChanged', call);
          };
        },
      );
    },
    [SendBirdCall, callee, setIsCall, setCallee, setCallCtx, setCallerTime],
  );

  return (
    <CustomForm>
      <div>
        <input
          type="text"
          value={callee || ''}
          placeholder="전화 받을 상대방의 ID를 입력하세요"
          onChange={(e) => setCallee(e.target.value)}
        />
      </div>
      <div>
        <button onClick={() => dial(true)}>영상 통화</button>
        <button onClick={() => dial(false)}>음성 통화</button>
      </div>
    </CustomForm>
  );
};

export default DialView;

const CustomForm = styled.div`
  padding: 1%;
  border: 1px solid black;
  width: 60%;
  max-width: 300px;
  margin: 0 auto;

  div {
    text-align: center;
  }

  input {
    width: 100%;
    box-sizing: border-box;
  }

  span {
    margin-right: 5%;
  }

  button {
    margin-top: 5%;
    text-align: center;
    margin-right: 3%;
  }
`;
