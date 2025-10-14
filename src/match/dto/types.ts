export type CreateMatch = {
  betValue: number;
  userId: number;
  status?: {
    STAND_BY: 'STAND_BY';
    STARTED: 'STARTED';
    FINISHED: 'FINISHED';
    ERROR: 'ERROR';
  };
  songId: number;
  message: string;
};
