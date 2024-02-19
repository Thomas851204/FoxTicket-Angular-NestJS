import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordService } from '../../core/authentication/password/password.service';
import { User } from '../../database/entities/user.entity';
import { Confirmation } from '../../database/entities/confirmations.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './models/dtos/register.dto';
import { LoginDto } from './models/dtos/loginDto';
import { JwtService } from '@nestjs/jwt';
import { UpdatedProfileDto } from './models/dtos/updateProfileDto';
import { EmailService } from '../../shared/services/email/email.service';
import { LoginViewModel } from './models/viewModels/loginViewModel';

@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    private passwordService: PasswordService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Confirmation)
    private confirmationRepository: Repository<Confirmation>,
    private emailService: EmailService,
  ) {}

  async createUser(userData: RegisterDto): Promise<boolean> {
    const hashedPassword = this.passwordService.hashPassword(userData.password);
    let alreadyinUserEntity = await this.userRepository.findOne({
      where: [{ username: userData.username }, { email: userData.email }],
    });
    let alreadyinConfirmEntity = await this.confirmationRepository.findOne({
      where: [{ username: userData.username }, { email: userData.email }],
    });
    if (alreadyinUserEntity || alreadyinConfirmEntity) {
      return false;
    }
    const confirmationCode = Math.floor(
      100000 + Math.random() * 900000,
    ) as unknown as string;

    const newConfirmation = this.confirmationRepository.create({
      email: userData.email,
      username: userData.username,
      password: hashedPassword,
      confirmationCode: confirmationCode,
    });

    try {
      await this.confirmationRepository.save(newConfirmation);

      this.emailService.confirmationEmail(
        userData.email,
        userData.username,
        confirmationCode,
      );

      return true;
    } catch (err) {
      return err;
    }
  }

  async confirmUser(
    confirmationCode: string,
  ): Promise<boolean | LoginViewModel> {
    const confirmation = await this.confirmationRepository.findOne({
      where: { confirmationCode: confirmationCode },
    });
    if (!confirmation) {
      return false;
    }

    const newUser = this.userRepository.create({
      email: confirmation.email,
      username: confirmation.username,
      password: confirmation.password,
    });

    try {
      const user = await this.userRepository.save(newUser);
      await this.confirmationRepository.remove(confirmation);

      const token = this.jwtService.sign({
        userId: user.id,
        username: user.username,
        isAdmin: user.role === 2,
      });

      const loginViewModel = new LoginViewModel();
      loginViewModel.token = token;
      loginViewModel.username = user.username;
      return loginViewModel;
    } catch (err) {
      return err;
    }
  }

  async login(loginDto: LoginDto): Promise<string> {
    const { username, password } = loginDto;
    const user: User = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const passwordMatch: boolean = this.passwordService.comparePasswords(
      password,
      user.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const token = this.jwtService.sign({
      userId: user.id,
      username: user.username,
      isAdmin: user.role === 2,
    });
    return token;
  }
  async storeProfilePicture(userInput: UpdatedProfileDto): Promise<string> {
    const {
      username,
      newPassword,
      originalPassword,
      confirmNewPassword,
      profilePicture,
      extension,
    } = userInput;
    let profilePicName: string = '';
    const user: User = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new HttpException('Invalid username or password', 400);
    }

    if (newPassword) {
      const passwordMatch: boolean = this.passwordService.comparePasswords(
        originalPassword,
        user.password,
      );
      if (!passwordMatch || confirmNewPassword !== newPassword) {
        throw new HttpException('Invalid username or password', 400);
      }

      const hashedPassword: string =
        this.passwordService.hashPassword(newPassword);
      await this.userRepository.update(
        { username },
        {
          password: hashedPassword,
        },
      );
    }

    if (profilePicture) {
      if (extension === 'unknown file') {
        throw new HttpException('Unknown file', 400);
      }
      await this.userRepository.update(
        { username },
        {
          profilePicture: username + '.' + extension,
        },
      );
      profilePicName = username + '.' + extension;
    }
    return profilePicName;
  }

  async getUser(username: string): Promise<UpdatedProfileDto> {
    if (!username) {
      throw new HttpException('Invalid username or password', 400);
    }

    const user: User = await this.userRepository.findOne({
      where: { username },
    });

    let userProfile: UpdatedProfileDto = new UpdatedProfileDto();
    if (!user) {
      throw new HttpException('Invalid username or password', 400);
    }

    userProfile.username = user.username;
    userProfile.email = user.email;
    userProfile.profilePicture = user.profilePicture;

    return userProfile;
  }
}
