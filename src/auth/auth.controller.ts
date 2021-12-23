import { Controller, Post, HttpStatus, HttpCode, Get, Response, Body, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User} from 'src/users/user.entity';
import { ClientProxy } from '@nestjs/microservices';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    @Inject('HELLO_SERVICE') private readonly client: ClientProxy,
    ) {}

  @Post('login')
  async loginUser(@Response() res: any, @Body() body: User) {
    if (!(body && body.username && body.password)) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: 'Username and password are required!' });
    }

    const user = await this.userService.getByUsername(body.username);
    
    if (user) {
      if (await this.userService.compareHash(body.password, user.password)) {
        this.client.emit('user-login', user)
        return res.status(HttpStatus.OK).json(await this.authService.createToken(user.id, user.username));
        

      }
    }

    return res.status(HttpStatus.FORBIDDEN).json({ message: 'Username or password wrong!' });
  }

  @Post('register')
  async registerUser(@Response() res: any, @Body() body: User) {
    if (!(body && body.username && body.password)) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: 'Username and password are required!' });
    }

    let user = await this.userService.getByUsername(body.username);
    let user2 = await this.userService.getByEmail(body.email);

    if (user || user2) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: 'Username or email exists' });
    } else {
      user = await this.userService.createUser(body);
      this.client.emit('user-create', user)
    }

    return res.status(HttpStatus.OK).json(user);
  }
}