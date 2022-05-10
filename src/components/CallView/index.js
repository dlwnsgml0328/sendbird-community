import React, { useCallback } from 'react';
import styled from 'styled-components';

const CallView = ({
  callCtx,
  calleeCtx,
  setIsCall,
  callerTime,
  calleeTime,
}) => {
  const localMediaViewRef = useCallback(
    (node) => {
      if (callCtx) {
        callCtx.setLocalMediaView(node);
      } else if (calleeCtx) {
        calleeCtx.setLocalMediaView(node);
      } else {
        return;
      }
    },
    [callCtx, calleeCtx],
  );

  const remotelMediaViewRef = useCallback(
    (node) => {
      if (callCtx) {
        callCtx.setRemoteMediaView(node);
      } else if (calleeCtx) {
        calleeCtx.setRemoteMediaView(node);
      } else {
        return;
      }
    },
    [callCtx, calleeCtx],
  );

  // 종료하기
  const closeOverlay = useCallback(() => {
    if (callCtx) {
      callCtx.end();
    } else if (calleeCtx) {
      calleeCtx.end();
    } else {
      return;
    }

    setIsCall(false);
  }, [callCtx, calleeCtx, setIsCall]);

  const confirm = useCallback(() => {
    const yes = window.confirm('Are you sure you want to exit the room?');

    if (yes) {
      closeOverlay();
    } else {
      return;
    }
  }, [closeOverlay]);

  return (
    <Overlay>
      <div className="CallViewWrapper">
        <span className="exit" onClick={() => closeOverlay()}>
          X
        </span>
        <h1>Hello CTX!</h1>
        {callCtx?._isVideoCall || calleeCtx?._isVideoCall ? (
          <div className="video_wrap">
            <div>
              <span>영상 통화</span>

              <p>
                통화 시간 :{' '}
                {callerTime
                  ? `${Math.floor(callerTime / 60)}:${
                      callerTime < 10 ? `0${callerTime}` : callerTime % 60
                    } `
                  : calleeTime
                  ? `${Math.floor(calleeTime / 60)}:${
                      calleeTime < 10 ? `0${calleeTime}` : calleeTime % 60
                    }`
                  : '0:00'}
              </p>
            </div>
            <VideoViewWrapper>
              <div>
                <span>
                  본인:{' '}
                  {callCtx
                    ? callCtx._caller.userId
                    : calleeCtx
                    ? calleeCtx._caller.userId
                    : null}
                </span>
                <video
                  ref={localMediaViewRef}
                  id="local_video_element_id"
                  autoPlay
                  muted
                />
              </div>
              <div>
                <span>
                  상대방:{' '}
                  {callCtx
                    ? callCtx._callee.userId
                    : calleeCtx
                    ? calleeCtx._caller.userId
                    : null}
                </span>
                <video
                  ref={remotelMediaViewRef}
                  id="remote_video_element_id"
                  autoPlay
                  muted={false}
                />
              </div>
            </VideoViewWrapper>
            <div className="btn_group">
              <button onClick={() => confirm()}>통화 종료</button>
            </div>
          </div>
        ) : (
          <div className="video_wrap">
            <div>
              <span>음성 통화</span>

              <p>
                통화 시간 :{' '}
                {callerTime
                  ? `${Math.floor(callerTime / 60)}:${
                      callerTime < 10 ? `0${callerTime}` : callerTime % 60
                    } `
                  : calleeTime
                  ? `${Math.floor(calleeTime / 60)}:${
                      calleeTime < 10 ? `0${calleeTime}` : calleeTime % 60
                    }`
                  : '0:00'}
              </p>
            </div>
            <AudioWrapper>
              <div>
                <span>
                  본인:{' '}
                  {callCtx
                    ? callCtx._caller.userId
                    : calleeCtx
                    ? calleeCtx._callee.userId
                    : null}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 114.3 60.7"
                >
                  <path d="M113.05,59.18l-2-.41c-42.82-8.89-65-8.89-107.82,0l-2,.41v-51l1.32-.27C45.42-1,68.89-1,111.74,7.92l1.31.27Z" />
                </svg>
                <audio ref={localMediaViewRef} autoPlay muted />
              </div>
              <div>
                <span>
                  상대방:{' '}
                  {callCtx
                    ? callCtx._callee.userId
                    : calleeCtx
                    ? calleeCtx._caller.userId
                    : null}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 114.3 60.7"
                >
                  <path d="M113.05,59.18l-2-.41c-42.82-8.89-65-8.89-107.82,0l-2,.41v-51l1.32-.27C45.42-1,68.89-1,111.74,7.92l1.31.27Z" />
                </svg>
                <audio ref={remotelMediaViewRef} autoPlay muted={false} />
              </div>
            </AudioWrapper>
            <div className="btn_group">
              <button onClick={() => confirm()}>통화 종료</button>
            </div>
          </div>
        )}
      </div>
    </Overlay>
  );
};

export default CallView;

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
    border: 1px solid #fff;
    background: #6211c8;
    color: #fff;
    padding: 0.5% 1%;
    cursor: pointer;
  }

  .CallViewWrapper {
    padding: 3%;

    .exit {
      position: absolute;
      top: 20px;
      right: 20px;
      cursor: pointer;
    }
  }

  .btn_group {
    margin-top: 5%;
    text-align: center;
  }

  @media only screen and (max-width: 480px) {
    h1 {
      display: none;
    }

    .CallViewWrapper {
      padding: 10% !important;
    }

    .btn_group {
      margin-top: 10%;
    }
  }
`;

const VideoViewWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin-top: 5%;

  div {
    width: 100%;
  }

  video {
    margin-top: 3%;
    border: 1px solid #000;
    width: 97%;
    height: auto;
    display: flex;
  }

  video:first-child {
    margin-right: 3%;
  }

  @media only screen and (max-width: 480px) {
    justify-content: center;
    flex-wrap: wrap;

    div {
      height: 30vh;
      padding-top: 5%;
    }

    div:last-child {
      margin-top: 5%;
    }

    svg {
      margin-top: 10%;
      width: 70%;
    }

    span {
      font-size: 6vw;
    }

    video {
      border: none;
      width: 100%;
    }

    video:first-child {
      margin-right: 0%;
    }
  }
`;

const AudioWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin-top: 5%;

  div {
    border: 2px solid #fff;
    width: 30%;
    height: 40vh;
    text-align: center;
    padding: 2%;
  }

  span {
    font-size: 2rem;
  }

  svg {
    margin-top: 20%;
  }

  path {
    stroke: #fff;
    fill: #6211c8;
  }

  @media only screen and (max-width: 480px) {
    justify-content: center;
    flex-wrap: wrap;

    div {
      width: 100%;
      height: 30vh;
      padding-top: 5%;
    }

    div:last-child {
      margin-top: 5%;
    }

    svg {
      margin-top: 10%;
      width: 70%;
    }

    span {
      font-size: 6vw;
    }
  }
`;
