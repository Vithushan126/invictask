// apps/organization-service/src/entities/team-member.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Team } from './team.entity';

@Entity('team_members')
export class TeamMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => Team, (team) => team.members)
  team: Team;

  @Column()
  teamId: string;

  @Column({ default: 'member' })
  role: 'lead' | 'member';

  @CreateDateColumn()
  joinedAt: Date;
}
