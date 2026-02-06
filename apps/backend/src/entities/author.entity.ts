import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Buku } from './book.entity';
import { User } from './user.entity';

@Entity('penulis')
export class Penulis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  nama: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy: string;

  @ManyToOne(() => User, (user) => user.penulisList, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  createdByUser: User;

  @OneToMany(() => Buku, (buku) => buku.penulis)
  bukuList: Buku[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
