import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entity/organization.entity';
import { OrganizationMember } from './entity/organization-member.entity';
import { Team } from './entity/team.entity';
import { Invitation } from './entity/invitation.entity';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { AddTeamMemberDto } from './dto/add-team-member.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamMember } from './entity/team-member.entity';
import { InviteMemberDto } from './dto/invite-member.dto';

@Injectable()
export class OrganizationServiceService {
  constructor(
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,

    @InjectRepository(OrganizationMember)
    private readonly memberRepo: Repository<OrganizationMember>,

    @InjectRepository(Team)
    private readonly teamRepo: Repository<Team>,

    @InjectRepository(Invitation)
    private readonly inviteRepo: Repository<Invitation>,

    @InjectRepository(TeamMember)
    private readonly teamMemberRepo: Repository<TeamMember>,

    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
    @Inject('USER_SERVICE') private userClient: ClientProxy,
    @Inject('FILE_SERVICE') private fileClient: ClientProxy,
    @Inject('NOTIFICATION_SERVICE') private notifyClient: ClientProxy,
  ) {}

  async createOrganization(data) {
    const org = this.orgRepo.create({
      name: data.name,
      description: data.description,
      logoUrl: data.logoUrl,
    });
    const savedOrg = await this.orgRepo.save(org);

    await this.memberRepo.save({
      userId: data.ownerId,
      organizationId: savedOrg.id,
      role: 'admin',
    });

    return savedOrg;
  }

  // Add member to organization, check duplicates
  async addMember(data) {
    const org = await this.orgRepo.findOne({
      where: { id: data.organizationId },
    });

    if (!org)
      throw new RpcException({
        statusCode: 404,
        message: 'Organization not found.',
      });

    const userExists = await this.userClient
      .send('get_user_by_id', { userId: data.userId })
      .toPromise()
      .catch(() => false);

    if (!userExists) {
      throw new RpcException({
        statusCode: 400,
        message: 'User does not exist.',
      });
    }

    const member = this.memberRepo.create({
      userId: data.userId,
      organizationId: data.organizationId,
      role: data.role ?? 'member',
    });

    return this.memberRepo.save(member);
  }

  async getOrganization(orgId: string) {
    const org = await this.orgRepo.findOne({
      where: { id: orgId },
      relations: ['members', 'teams'],
    });

    if (!org) {
      throw new RpcException({
        statusCode: 404,
        message: 'Organization not found.',
      });
    }

    return org;
  }

  // Get members of an organization
  async getOrganizationMembers(orgId: string) {
    // Check if organization exists
    const org = await this.orgRepo.findOne({ where: { id: orgId } });
    if (!org) {
      throw new RpcException({
        statusCode: 404,
        message: 'Organization not found.',
      });
    }

    // Fetch members
    const members = await this.memberRepo.find({
      where: { organizationId: orgId },
    });

    return members;
  }

  async createTeam(data: CreateTeamDto) {
    const org = await this.orgRepo.findOne({
      where: { id: data.organizationId },
    });
    if (!org) {
      throw new RpcException({
        statusCode: 404,
        message: 'Organization not found.',
      });
    }

    const existingTeam = await this.teamRepo.findOne({
      where: { name: data.name, organizationId: data.organizationId },
    });
    if (existingTeam) {
      throw new RpcException({
        statusCode: 409,
        message: 'Team with this name already exists in this organization.',
      });
    }

    const team = this.teamRepo.create({
      name: data.name,
      description: data.description,
      organizationId: data.organizationId,
    });
    return this.teamRepo.save(team);
  }

  async addTeamMember(data: AddTeamMemberDto) {
    const team = await this.teamRepo.findOne({ where: { id: data.teamId } });
    if (!team) {
      throw new RpcException({
        statusCode: 404,
        message: 'Team not found.',
      });
    }

    // Check if user is already a member of the team
    const existingMember = await this.teamMemberRepo.findOne({
      where: {
        teamId: data.teamId,
        userId: data.userId,
      },
    });

    if (existingMember) {
      throw new RpcException({
        statusCode: 409,
        message: 'User is already a member of this team.',
      });
    }

    // Optional: Check if user exists via USER_SERVICE
    let userExists = false;
    try {
      userExists = await this.userClient
        .send('get_user_by_id', { userId: data.userId })
        .toPromise();
    } catch (err) {
      throw new RpcException({
        statusCode: 500,
        message: 'Failed to verify user existence via user service.',
      });
    }

    if (!userExists) {
      throw new RpcException({
        statusCode: 400,
        message: 'User does not exist.',
      });
    }

    const teamMember = this.teamMemberRepo.create({
      teamId: data.teamId,
      userId: data.userId,
      role: data.role ?? 'member',
    });

    return this.teamMemberRepo.save(teamMember);
  }

  async getTeamMembers(teamId: string) {
    // Validate if the team exists
    const team = await this.teamRepo.findOne({ where: { id: teamId } });
    if (!team) {
      throw new RpcException({
        statusCode: 404,
        message: 'Team not found.',
      });
    }

    // Fetch team members
    const members = await this.teamMemberRepo.find({
      where: { teamId },
    });

    // Optional: If you want to enforce that empty members = error
    if (!members || members.length === 0) {
      throw new RpcException({
        statusCode: 404,
        message: 'No members found for this team.',
      });
    }

    return members;
  }

  // async inviteMember(data: InviteMemberDto) {
  //   const { organizationId, email, invitedByUserId } = data;

  //   try {
  //     // 1. Validate organization exists
  //     const org = await this.orgRepo.findOne({ where: { id: organizationId } });
  //     if (!org) {
  //       throw new RpcException({
  //         statusCode: 404,
  //         message: 'Organization not found.',
  //       });
  //     }

  //     // 2. Prevent inviting yourself (optional)
  //     const invitingUser = await this.memberRepo.findOne({
  //       where: { userId: invitedByUserId, organizationId },
  //     });

  //     if (!invitingUser) {
  //       throw new RpcException({
  //         statusCode: 403,
  //         message: 'You are not a member of this organization.',
  //       });
  //     }

  //     if (invitingUser && invitingUser.email === email) {
  //       throw new RpcException("You can't invite yourself.");
  //     }

  //     // 3. Check if user is already a member
  //     const isAlreadyMember = await this.memberRepo.findOne({
  //       where: { email, organizationId },
  //     });
  //     if (isAlreadyMember) {
  //       throw new RpcException('User is already a member of the organization.');
  //     }

  //     // 4. Check for existing pending invitation
  //     const existingInvite = await this.inviteRepo.findOne({
  //       where: { email, organizationId, status: 'pending' },
  //     });

  //     if (existingInvite) {
  //       if (existingInvite.expiresAt > new Date()) {
  //         throw new RpcException(
  //           'An active invitation already exists for this user.',
  //         );
  //       } else {
  //         await this.inviteRepo.remove(existingInvite);
  //       }
  //     }

  //     // 5. Create invitation
  //     const token = crypto.randomUUID();
  //     const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  //     const invitation = this.inviteRepo.create({
  //       organizationId,
  //       invitedByUserId,
  //       email,
  //       status: 'pending',
  //       token,
  //       expiresAt,
  //     });

  //     const savedInvite = await this.inviteRepo.save(invitation);

  //     // 6. Emit to Notification Microservice
  //     this.notifyClient.emit('send_invitation_email', {
  //       email,
  //       organizationName: org.name,
  //       token,
  //       expiresAt,
  //     });

  //     return savedInvite;
  //   } catch (error) {
  //     // If already an RpcException, just rethrow
  //     if (error instanceof RpcException) {
  //       throw error;
  //     }

  //     // Wrap other errors
  //     throw new RpcException(
  //       error?.message || 'Something went wrong during invitation.',
  //     );
  //   }
  // }
}
