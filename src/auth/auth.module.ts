import * as passport from 'passport';
import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [UsersModule,
    ClientsModule.register([
      { 
        name: 'HELLO_SERVICE', transport: Transport.RMQ,
        options: {
          urls: ['amqps://kvgdueek:adI0gUg8tzk4ZtmfTefUYkXc7MJW82m_@roedeer.rmq.cloudamqp.com/kvgdueek'],
          queue: 'user-messages',
          queueOptions: {
            durable: true
                },
          },
       },
     ]),],
  
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(passport.authenticate('jwt', { session: false }))
      .forRoutes(
        { path: '/products', method: RequestMethod.ALL },
        { path: '/products/*', method: RequestMethod.ALL });
  }
}