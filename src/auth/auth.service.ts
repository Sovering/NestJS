import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) { }

  async createToken(id: number, username: string) {
    const expiresIn = 60 * 60;
    const secretOrKey = 'secret';
    const user = { username };
    const token = "Bearer " + jwt.sign(user, secretOrKey, { expiresIn });

    return { expires_in: expiresIn, token };
  }

  async validateUser(signedUser){
    if (signedUser&&signedUser.username) {
      return Boolean(this.usersService.getByUsername(signedUser.username));
    }

    return false;
  }
}