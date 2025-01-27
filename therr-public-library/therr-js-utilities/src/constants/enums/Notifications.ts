export enum Types {
  ACHIEVEMENT_COMPLETED = 'ACHIEVEMENT_COMPLETED',
  CONNECTION_REQUEST_ACCEPTED = 'CONNECTION_REQUEST_ACCEPTED',
  CONNECTION_REQUEST_RECEIVED = 'CONNECTION_REQUEST_RECEIVED',
  NEW_LIKE_RECEIVED = 'NEW_LIKE_RECEIVED',
  NEW_SUPER_LIKE_RECEIVED = 'NEW_SUPER_LIKE_RECEIVED',
  NEW_DM_RECEIVED = 'NEW_DM_RECEIVED',
  NEW_AREAS_ACTIVATED = 'NEW_AREAS_ACTIVATED',
  DISCOVERED_UNIQUE_MOMENT = 'DISCOVERED_UNIQUE_MOMENT',
  DISCOVERED_UNIQUE_SPACE = 'DISCOVERED_UNIQUE_SPACE',
  THOUGHT_REPLY = 'THOUGHT_REPLY',
}

export enum MessageKeys {
  ACHIEVEMENT_COMPLETED = 'notifications.achievementCompleted',
  CONNECTION_REQUEST_ACCEPTED = 'notifications.connectionRequestAccepted',
  CONNECTION_REQUEST_RECEIVED = 'notifications.connectionRequestReceived',
  NEW_LIKE_RECEIVED = 'notifications.reactionLikeReceived',
  NEW_SUPER_LIKE_RECEIVED = 'notifications.reactionSuperLikeReceived',
  NEW_DM_RECEIVED = 'notifications.newDmReceived',
  NEW_AREAS_ACTIVATED = 'notifications.newAreasActivated',
  DISCOVERED_UNIQUE_MOMENT = 'notifications.discoveredUniqueMoment',
  DISCOVERED_UNIQUE_SPACE = 'notifications.discoveredUniqueSpace',
  THOUGHT_REPLY = 'notifications.newThoughtReplyReceived',
}
