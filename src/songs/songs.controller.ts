import { BadRequestException, Headers, Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectID } from 'mongodb';
import { Songs } from './songs.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import jwt_decode from "jwt-decode";
import { UsersService } from 'src/users/users.service';
import { CategoriesService } from './categories.service';
import { Categories } from './categories.entity';



@Controller('songs')
export class SongsController {
    constructor(
        @InjectRepository(Songs)
        private readonly songsRepository: MongoRepository<Songs>,
        private readonly userService: UsersService,
        private readonly categService: CategoriesService
      ) {}
    @Get()
    async getSongs(): Promise<Songs[]> {
        return await this.songsRepository.find();
    }
    @Get(':id')
    async getSong(@Param('id') id): Promise<Songs> {
        const song = ObjectID.isValid(id) && await this.songsRepository.findOne(id);
        if (!song) {
            // Entity not found
            throw new NotFoundException();
        }
        return song;
    }
    @Post()
    @UseGuards(JwtAuthGuard)
    async createAsset(@Body() song: Partial<Songs>, @Headers() headers): Promise<Songs> {
        if (!song || !song.name ) {
            throw new BadRequestException(`An asset must have at least name and cost defined`);
        }
        if(!song.categories){
            let categ: string[] = ["others"]
            song.categories = categ;
        }else{
            var i: number = 0;
            let categ: string[] = [];
            for(i = 0; i < song.categories.length; i++ ){
                let category: Categories = await this.categService.getByName(song.categories[i]);
                if(category){
                    categ.push(song.categories[i]);
                }
            }
            song.categories = categ;
        }
        var decoded = jwt_decode(String(headers.authorization).replace("Bearer ", ""));
        let user: string[] = [(await this.userService.getByUsername(decoded['username'])).id.toString()];
        song.user = user
        return await this.songsRepository.save(new Songs(song));
    }
    @Put(':id')
    @HttpCode(204)
    async updateAsset(@Param('id') id, @Body() song: Partial<Songs>): Promise<void> {

        const exists = ObjectID.isValid(id) && await this.songsRepository.findOne(id);
        if (!exists) {
            throw new NotFoundException();
        }
        if(song.categories){
            var i: number = 0;
            let categ: string[] = [];
            for(i = 0; i < song.categories.length; i++ ){
                let category: Categories = await this.categService.getByName(song.categories[i]);
                if(category){
                    categ.push(song.categories[i]);
                }
            }
            song.categories = categ;
        }
        await this.songsRepository.update(id, song);
    }
    @Delete(':id')
    @HttpCode(204)
    async deleteAsset(@Param('id') id): Promise<void> {
        // Check if entity exists
        const exists = ObjectID.isValid(id) && await this.songsRepository.findOne(id);
        if (!exists) {
            throw new NotFoundException();
        }
        await this.songsRepository.delete(id);
    }
}
