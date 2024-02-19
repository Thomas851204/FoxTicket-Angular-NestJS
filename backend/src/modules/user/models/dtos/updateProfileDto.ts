export class UpdatedProfileDto {
  username: string;
  newPassword?: string;
  originalPassword?: string;
  confirmNewPassword?: string;
  profilePicture?: string;
  email?: string;
  extension?: string;
}
