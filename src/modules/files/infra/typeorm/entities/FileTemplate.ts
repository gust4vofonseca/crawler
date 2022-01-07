import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('file_templates')
export class FileTemplate {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  court: string;

  @Column()
  example_process_number: string;
}
