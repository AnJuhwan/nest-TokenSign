import { IsEmail } from 'class-validator';

class UsersDto {
  id: number;
  userId: string;
  @IsEmail()
  email: string;

  password: string;
  nickname: string;
  deleted_yn: number;
  modified_at: string;
  created_at: string;
  report_number: number;
  route: string;
}

export default UsersDto;
