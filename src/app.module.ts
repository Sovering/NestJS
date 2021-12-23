import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsController } from './songs/songs.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Songs } from './songs/songs.entity';
import { UsersModule } from './users/users.module';

import { AuthModule } from './auth/auth.module';
import { CategoriesService } from './songs/categories.service';
import { Categories } from './songs/categories.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ChatModule } from './websocket/chat.module';

@Module({
  imports: [
   
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb+srv://vnkim:pl8LPmsFl78scpr2@kimv.aiexg.mongodb.net/',
      database: "DataBaseAudioEd",
      entities: [
        __dirname + '/**/*.entity{.ts,.js}',
      ],
      ssl: true,
      useUnifiedTopology: true,
      useNewUrlParser: true
    }),
    TypeOrmModule.forFeature([Songs, Categories]),
    UsersModule, AuthModule, ChatModule],

    
  controllers: [AppController, SongsController],
  providers: [AppService, CategoriesService],
})
export class AppModule {}
