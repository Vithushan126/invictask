// apps/organization-service/src/entities/organization-member.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Organization } from './organization.entity';

@Entity('organization_members')
export class OrganizationMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string; // From user-service

  @ManyToOne(() => Organization, (org) => org.members)
  organization: Organization;

  @Column()
  organizationId: string;

  @Column({ default: 'member' })
  role: 'admin' | 'member' | 'guest';

  @CreateDateColumn()
  joinedAt: Date;
}
