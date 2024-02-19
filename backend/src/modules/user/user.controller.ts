import {
  Controller,
  Post,
  Body,
  Put,
  UsePipes,
  ValidationPipe,
  Headers,
  Get,
  Res,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common';
import { RegisterDto } from './models/dtos/register.dto';
import { UserService } from './user.service';
import { MatchingPasswordsValidationPipe } from './pipes/matching-passwords-validation/matching-passwords-validation.pipe';
import { LoginDto } from './models/dtos/loginDto';
import { LoginViewModel } from './models/viewModels/loginViewModel';
import { ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import * as fs from 'fs';
import { UpdatedProfileDto } from './models/dtos/updateProfileDto';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  @UsePipes(new ValidationPipe(), new MatchingPasswordsValidationPipe())
  @ApiOkResponse({ description: 'User registration' })
  async createUser(@Body() userData: RegisterDto): Promise<boolean> {
    return await this.userService.createUser(userData);
  }

  @Post('login')
  @ApiResponse({ description: 'User login' })
  async login(@Body() loginDto: LoginDto): Promise<LoginViewModel> {
    const token = await this.userService.login(loginDto);
    const loginViewModel: LoginViewModel = {
      username: loginDto.username,
      token: token,
    };
    return loginViewModel;
  }

  base64FileHeaderMapper(fileBase64) {
    let fileHeader = new Map();

    fileHeader.set('/9j', 'JPG');
    fileHeader.set('iVB', 'PNG');
    fileHeader.set('Qk0', 'BMP');
    fileHeader.set('SUk', 'TIFF');

    let res = '';

    fileHeader.forEach((v, k) => {
      if (k == fileBase64.substr(0, 3)) {
        res = v;
      }
    });

    if (res == '') {
      res = 'unknown file';
    }

    return res;
  }

  @Put('updateUser')
  @ApiOkResponse({ description: 'Update user' })
  async updateUser(
    @Body() userInput: UpdatedProfileDto,
    @Res() res,
  ): Promise<string> {
    let buffer;
    if (userInput.profilePicture) {
      buffer = Buffer.from(userInput.profilePicture, 'base64');
      userInput.extension = this.base64FileHeaderMapper(
        userInput.profilePicture,
      ).toLowerCase();
    }

    let profilePicName = await this.userService.storeProfilePicture(userInput);

    if (profilePicName !== '' && buffer) {
      fs.writeFile(`./profiles/${profilePicName}`, buffer, (err) => {
        if (err) {
          return false;
        }
      });
    }

    res.status(200);
    return res.json({ profilePicName });
  }

  @Get('getUser')
  @ApiOkResponse({ description: 'Get user info' })
  async getUser(@Headers() header, @Res() res): Promise<UpdatedProfileDto> {
    const username = this.decode(header).username;
    let userProfile = await this.userService.getUser(username);
    return res.send(userProfile);
  }

  @Get('confirmation/:confirmationCode')
  @ApiOkResponse({ description: 'User confirmation' })
  async emailConfirmation(
    @Param('confirmationCode') confirmationCode: string,
  ): Promise<boolean | LoginViewModel> {
    return await this.userService.confirmUser(confirmationCode);
  }
  private decode(header: any): any {
    return this.jwtService.verify(header.authorization);
  }
}
