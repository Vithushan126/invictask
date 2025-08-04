import { Controller, Get } from '@nestjs/common';
import { OrganizationServiceService } from './organization-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { AddTeamMemberDto } from './dto/add-team-member.dto';

@Controller()
export class OrganizationServiceController {
  constructor(private readonly orgService: OrganizationServiceService) {}

  @MessagePattern('create_organization')
  createOrg(@Payload() payload: CreateOrganizationDto) {
    return this.orgService.createOrganization(payload);
  }

  @MessagePattern('add_organization_member')
  addMember(@Payload() data: any) {
    return this.orgService.addMember(data);
  }

  @MessagePattern('get_organization')
  getOrganization(@Payload() id: string) {
    return this.orgService.getOrganization(id);
  }

  @MessagePattern('get_organization_members')
  getOrganizationMembers(@Payload() orgId: string) {
    return this.orgService.getOrganizationMembers(orgId);
  }

  @MessagePattern('create_team')
  createTeam(@Payload() data: CreateTeamDto) {
    return this.orgService.createTeam(data);
  }

  @MessagePattern('add_team_member')
  addTeamMember(@Payload() data: AddTeamMemberDto) {
    return this.orgService.addTeamMember(data);
  }

  @MessagePattern('get_team_members')
  getTeamMembers(@Payload() teamId: string) {
    return this.orgService.getTeamMembers(teamId);
  }

  // @MessagePattern('invite_member')
  // inviteMember(@Payload() data: any) {
  //   return this.orgService.inviteMember(data);
  // }

  // @MessagePattern('accept_invitation')
  // acceptInvitation(@Payload() data: any) {
  //   return this.orgService.acceptInvitation(data);
  // }
}
