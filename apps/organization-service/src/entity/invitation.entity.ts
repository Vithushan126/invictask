// apps/organization-service/src/entities/invitation.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('invitations')
export class Invitation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @Column()
  invitedByUserId: string;

  @Column()
  email: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'accepted' | 'declined';

  @Column()
  token: string;

  @Column()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
