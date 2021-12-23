import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository, Repository } from 'typeorm';
import { ObjectID } from 'mongodb';
import RegisterDto from './dto/register.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import jwt_decode from "jwt-decode";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: MongoRepository<User>
  ) {}
  
  async getByEmail(email: string) {
    return (await this.usersRepository.findOne({ email }));
    
  }
  async getByUsername(username: string) {
    return (await this.usersRepository.findOne({ username }));

  }
 
  async create(userData: RegisterDto) {
    const newUser = await this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    return newUser;
  }
  async update(userData: Partial<User>, token: string) {
    var decoded = jwt_decode(token);
    let oldUser: User = await this.getByUsername(decoded['username']);    
    oldUser.id = null;
    if (oldUser){
      if(userData.username){
        let user: User = await this.getByUsername(userData.username);
        if (!user) {
          oldUser.username = userData.username;
      }
      }
      if(userData.password){
          oldUser.password = await this.getHash(userData.password);;
      }
      if(userData.email){
        let user: User = await this.getByEmail(userData.email);
        if (!user) {
            oldUser.email = userData.email;
        }
      }
      
      await this.usersRepository.update((await this.getByUsername(decoded['username'])).id, oldUser);
    }
  }

  async getById(id: number) {
    const user = await this.usersRepository.findOne({ id });
    if (user) {
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }
  async createUser(user: User){
    user.password = await this.getHash(user.password);
   
    return this.usersRepository.save(user);
  }

  async getHash(password: string|undefined) {
      return bcrypt.hash(password, 10);
  }

  async compareHash(password: string|undefined, hash: string|undefined) {
    return bcrypt.compare(password, hash);
  }
}
