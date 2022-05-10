import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

const RingingView = ({ calleeCtx, setRinging, setIsCall, setCalleeTime }) => {
  const [caller, setCaller] = useState('');

  useEffect(() => {
    if (calleeCtx) setCaller(calleeCtx._caller.userId);
  }, [calleeCtx]);

  const accept = useCallback(
    (calleeCtx) => {
      const acceptParams = {
        callOption: {
          localMediaView: undefined,
          remoteMediaView: undefined,
          audioEnabled: true,
          videoEnabled: true,
        },
      };

      let time = 0;

      calleeCtx.onEstablished = (calleeCtx) => {
        console.log('callee onEstablished', calleeCtx);
      };

      calleeCtx.onConnected = (calleeCtx) => {
        console.log('callee onConnected', calleeCtx);
        setRinging(false);
        setIsCall(true);

        calleeCtx.startVideo();

        time = setInterval(() => {
          // console.log(
          //   Math.floor(Number(calleeCtx.getDuration() / 1000)) + '초',
          // );
          setCalleeTime(Math.floor(Number(calleeCtx.getDuration() / 1000)));
        }, [1000]);
      };

      calleeCtx.onEnded = (calleeCtx) => {
        console.log('callee onEnded', calleeCtx);
        clearInterval(time);
        setIsCall(false);
      };

      calleeCtx.onRemoteAudioSettingsChanged = (calleeCtx) => {
        console.log('callee onRemoteAudioSettingsChanged', calleeCtx);
      };

      calleeCtx.onRemoteVideoSettingsChanged = (calleeCtx) => {
        console.log('callee onRemoteVideoSettingsChanged', calleeCtx);
      };

      calleeCtx.accept(acceptParams);
    },
    [setIsCall, setRinging, setCalleeTime],
  );

  const end = useCallback(() => {
    calleeCtx.end();
    setRinging(false);
  }, [calleeCtx, setRinging]);

  return (
    <>
      {calleeCtx ? (
        <Overlay>
          <div className="RingingViewWrapper">
            <div className="caller_info">
              <span className="caller" role="img" aria-label="emoji">
                🤙🏼 {caller} (으/로) 부터 온 전화입니다
              </span>
              <div>
                <button type="button" onClick={() => accept(calleeCtx)}>
                  수락
                </button>
                <button type="button" onClick={() => end()}>
                  거절
                </button>
              </div>
            </div>
          </div>
        </Overlay>
      ) : null}
    </>
  );
};

export default RingingView;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  background: #6211c8;
  color: #fff;

  button {
    background: #6211c8;
    margin-top: 3%;
    margin-right: 3%;
    border: 2px solid #fff;
    padding: 1% 2%;
    font-size: 1rem;
    color: #fff;

    cursor: pointer;

    :hover {
      font-weight: bold;
    }
  }

  .RingingViewWrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid #fff;
    width: 100%;
    height: 100%;
  }

  .caller_info {
    border: 2px solid #fff;
    padding: 2%;
    text-align: center;
  }

  .caller {
    font-size: 2rem;
  }

  @media only screen and (max-width: 480px) {
    .caller {
      font-size: 1rem;
    }
  }
`;
