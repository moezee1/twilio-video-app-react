import React from 'react';
import ParticipantInfo from '../ParticipantInfo/ParticipantInfo';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import { Participant as IParticipant } from 'twilio-video';

interface ParticipantProps {
  participant: IParticipant;
  disableAudio?: boolean;
  enableScreenShare?: boolean;
  onClick: () => void;
  isSelected: boolean;
  isDominantSpeaker?: boolean;
  isLocalParticipant?: boolean;
}

export default function Participant({
  participant,
  disableAudio,
  enableScreenShare,
  onClick,
  isSelected,
  isLocalParticipant,
}: ParticipantProps) {
  return (
    <ParticipantInfo
      participant={participant}
      onClick={onClick}
      isSelected={isSelected}
      isLocalParticipant={isLocalParticipant}
    >
      <ParticipantTracks
        participant={participant}
        disableAudio={disableAudio}
        enableScreenShare={enableScreenShare}
        isLocalParticipant={isLocalParticipant}
      />
    </ParticipantInfo>
  );
}
