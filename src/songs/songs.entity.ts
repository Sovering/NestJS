import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

@Entity('songs')
export class Songs {
  @ObjectIdColumn() id: ObjectID;
  @Column() name: string;
  @Column() description?: string;
  @Column() user: string[];
  @Column() categories: string[];

  constructor(songs?: Partial<Songs>) {
    Object.assign(this, songs);
  }
}