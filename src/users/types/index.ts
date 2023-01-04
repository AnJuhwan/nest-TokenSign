export interface IResetPassword {
  id: number;
  userId: string;
  password: string;
}

export interface IChangeNickname {
  userId: string;
  nickname: string;
}
