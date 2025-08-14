import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'member' })
  role: 'owner' | 'member';

  @Column({ nullable: true, type: 'varchar' })
  resetToken?: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpires: Date | null;
}
