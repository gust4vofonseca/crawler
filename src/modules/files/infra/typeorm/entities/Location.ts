import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('locations')
export class Location {
  @PrimaryColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @Column()
  initials: string;

  @Column()
  region: string;
}
