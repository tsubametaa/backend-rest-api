import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Penulis } from './author.entity';

@Entity('buku')
export class Buku {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  judul: string;

  @Column({ length: 20, unique: true, nullable: true })
  isbn: string;

  @Column({ name: 'tahun_terbit', type: 'int', nullable: true })
  tahunTerbit: number;

  @Column({ name: 'penulis_id', type: 'uuid' })
  penulisId: string;

  @ManyToOne(() => Penulis, (penulis) => penulis.bukuList, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'penulis_id' })
  penulis: Penulis;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
