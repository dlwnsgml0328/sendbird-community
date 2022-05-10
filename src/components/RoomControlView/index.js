import React, { useCallback } from 'react';
import styled from 'styled-components';

const RoomControllerView = ({
  SendBirdCall,
  roomId,
  setRoomId,
  setRoomCtx,
  setRoomDone,
}) => {
  // 방 만들기
  const createRoom = useCallback(() => {
    // const customItem = { key1: 'value1' };
    const roomParams = {
      roomType: SendBirdCall.RoomType.LARGE_ROOM_FOR_AUDIO_ONLY,
      // customItem: customItem,
    };

    SendBirdCall.createRoom(roomParams)
      .then((room) => {
        console.log('room created', room);
        setRoomCtx(room);
        // room.setAudioForLargeRoom(null);
      })
      .catch((e) => {
        console.log('Failed to create room', e);
      })
      .finally(() => {
        console.log('Room processing complete');
      });
  }, [SendBirdCall, setRoomCtx]);

  // 방 입장하기
  const enterRoom = useCallback(() => {
    SendBirdCall.fetchRoomById(roomId)
      .then((room) => {
        console.log('fetch room successfully', room, room.participants);
        setRoomCtx(room);

        const enterParams = { audioEnalbed: true };

        // custom logic
        const customItem = { key1: '' };
        room
          .updateCustomItems(customItem)
          .then((res) => {
            console.log('enter room customItem updated', res);
          })
          .catch((err) => {
            console.log('err: ', err);
          });

        room
          .enter(enterParams)
          .then(() => {
            console.log('User has successfully joined');
            setRoomDone(true);
          })
          .catch((error) => {
            console.log('failed to join room', error);
          });

        room.on('customItemsUpdated', (customItems, affectedKeys) => {
          // console.log('# customItemsUpdated');
          // console.log('# customItems: ', customItems);
          // console.log('# affectedKeys: ', affectedKeys);
          SendBirdCall.fetchRoomById(roomId)
            .then((room) => {
              console.log('customItemsUpdated room', room);
              setRoomCtx({
                ...room,
                participants: room.participants,
                remoteParticipants: room.remoteParticipants,
                localParticipants: room.localParticipants,
              });
            })
            .catch((err) => {
              console.log('error', err);
            });
        });

        room.on('remoteParticipantEntered', (participant) => {
          console.log('@ participant entered', participant);

          SendBirdCall.fetchRoomById(roomId)
            .then((room) => {
              setRoomCtx({
                ...room,
                participants: room.participants,
                remoteParticipants: room.remoteParticipants,
                localParticipants: room.localParticipants,
              });
            })
            .catch((error) => {
              console.log('error', error);
            });
        });

        room.on('remoteParticipantExited', (participant) => {
          console.log('@ participant exited', participant);

          SendBirdCall.fetchRoomById(roomId).then((room) => {
            setRoomCtx({
              ...room,
              participants: room.participants,
              remoteParticipants: room.remoteParticipants,
              localParticipants: room.localParticipants,
            });
            console.log('@ room updated by exit: ', room);
          });
        });

        room.on('remoteParticipantStreamStarted', (participant) => {
          console.log('@ participant stream started', participant);
          SendBirdCall.fetchRoomById(roomId).then((room) => {
            setRoomCtx(room);
            console.log('@ room updated by stream: ', room);
          });
        });

        room.on('remoteAudioSettingsChanged', (participant) => {
          console.log('@ participant audio setting changed', participant);
          SendBirdCall.fetchRoomById(roomId).then((room) => {
            setRoomCtx(room);
            console.log('@ room updated by audio setting: ', room);
          });
        });
      })
      .catch((error) => {
        console.log('error fetching room', error);
      });
  }, [SendBirdCall, setRoomDone, roomId, setRoomCtx]);

  return (
    <RoomController>
      <div className="room_container">
        <div>
          <span>방 만들기</span>
        </div>
        <button type="button" onClick={() => createRoom()}>
          방 만들기
        </button>
      </div>
      <div className="room_container">
        <div>
          <span>방 입장하기</span>
        </div>
        <div>
          <input
            type="text"
            placeholder="들어갈 방의 ID를 입력하세요"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
        </div>
        <div>
          <button type="button" onClick={() => enterRoom()}>
            입장하기
          </button>
        </div>
      </div>
    </RoomController>
  );
};

export default RoomControllerView;

const RoomController = styled.div`
  display: flex;
  height: 40vh;
  align-items: center;

  .room_container {
    border: 1px solid #000;
    height: 100%;
    margin: 32px;
    text-align: center;
    width: 100%;
    min-width: 200px;

    input {
      width: 180px;
    }

    div {
      margin: 3% 0;
    }
  }

  @media screen and (max-width: 480px) {
    flex-wrap: wrap;
    font-size: 4vw;

    .room_container {
      width: 100%;
      height: 80%;
    }

    input {
      width: 300px;
    }
  }
`;

/* 
Room event map

  remoteParticipantEntered: { args: [RemoteParticipant]; };
  remoteParticipantExited: { args: [RemoteParticipant]; };
  remoteParticipantStreamStarted: { args: [RemoteParticipant]; };
  remoteAudioSettingsChanged: { args: [RemoteParticipant]; };
  remoteVideoSettingsChanged: { args: [RemoteParticipant]; };
  customItemsUpdated: { args: [CustomItems, string[]] };
  customItemsDeleted: { args: [CustomItems, string[]] };
  deleted: {};
  error: { args: [Error, Participant?] };
 */
