export interface UpdatedProfile {
  username: string;
  newPassword?: string;
  originalPassword?: string;
  confirmNewPassword?: string;
  email?: string;
  profilePicture?: any;
}
