export interface IConfettiSettings {
  target: string;
  clock: number;
  max: number;
}

export const confettiSettings: IConfettiSettings = {
  target: 'confetti',
  clock: 10,
  max: 50
};
