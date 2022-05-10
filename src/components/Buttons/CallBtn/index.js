import React, { useCallback } from 'react';

export const CallBtn = ({
  SendBirdCall,
  callee,
  setIsCall,
  setCallCtx,
  setCallerTime,
}) => {
  const dial = useCallback(() => {
    window.scrollTo(0, 0);
    SendBirdCall.dial(
      {
        userId: callee,
        isVideoCall: false,
        callOption: {
          localMediaView: undefined,
          remoteMediaView: undefined,
          audioEnabled: true,
          videoEnabled: false,
        },
      },
      (call, error) => {
        if (error) {
          console.error('error occured in call', error);
          return;
        } else {
          console.log('success call process', call);

          setIsCall(true);
          setCallCtx(call);

          let time = 0;

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
        }
      },
    );
  }, [SendBirdCall, callee, setCallCtx, setCallerTime, setIsCall]);

  return (
    <button type="button" onClick={() => dial()}>
      전화하기
    </button>
  );
};
