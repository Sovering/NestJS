import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MongoRepository, ObjectID } from "typeorm";
import { Categories } from "./categories.entity";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private categRepository: MongoRepository<Categories>
  ) {}
  async getByName(name: string) {
    return (await this.categRepository.findOne({ name }));
  }
  async getByAll(username: string) {
    return (await this.categRepository.find());
  }
}