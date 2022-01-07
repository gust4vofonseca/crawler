import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('process_files')
export class ProcessFile {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'court', type: 'varchar' })
  court: string;

  @Column({ name: 'lines', type: 'bigint' })
  lines: number;

  @Column({ name: 'processed', type: 'bigint', default: 0 })
  processed: number;

  @Column({ nullable: true, name: 'zip_name', type: 'varchar' })
  zip_name: string;

  @CreateDateColumn({ name: 'created_at', default: () => 'now()' })
  created_at: Date;

  @Expose({ name: 'file_url' })
  getFileUrl?(): string {
    const url =
      process.env.NODE_ENV === 'dev'
        ? 'http://localhost:4004'
        : process.env.NODE_ENV === 'hom'
        ? 'https://api-hom.precato.com.br'
        : 'https://api.precato.com.br';

    return `${url}/tjs/${this.court.replace('TJ', '').toLowerCase()}/uploads/${
      this.name
    }`;
  }

  @Expose({ name: 'zip_url' })
  getZipUrl?(): string {
    const url =
      process.env.NODE_ENV === 'dev'
        ? 'http://localhost:4004'
        : process.env.NODE_ENV === 'hom'
        ? 'https://api-hom.precato.com.br'
        : 'https://api.precato.com.br';

    return `${url}/tjs/${this.court.replace('TJ', '').toLowerCase()}/zips/${
      this.zip_name
    }.zip`;
  }
}
