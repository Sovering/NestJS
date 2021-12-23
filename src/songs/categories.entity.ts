import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

@Entity('categories')
export class Categories {
  @ObjectIdColumn() id: ObjectID;
  @Column() name: string;

  constructor(categories?: Partial<Categories>) {
    Object.assign(this, categories);
  }
}