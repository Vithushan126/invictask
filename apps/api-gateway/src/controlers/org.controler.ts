import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Inject,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('organizations')
export class OrganizationController {
  constructor(
    @Inject('ORGANIZATION_SERVICE') private readonly orgClient: ClientProxy,
  ) {}

  @Post('/create')
  async create(@Body() body: any) {
    try {
      const response = await firstValueFrom(
        this.orgClient.send('create_organization', body),
      );
      return response;
    } catch (err) {
      console.error('Error creating organization:', err);
      throw new HttpException(
        err?.message || 'Failed to create organization',
        err?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/members/:id')
  async addMember(@Param('id') orgId: string, @Body() body: any) {
    try {
      const payload = { organizationId: orgId, ...body };
      const response = await firstValueFrom(
        this.orgClient.send('add_organization_member', payload),
      );
      return response;
    } catch (err) {
      console.error('Error adding organization member:', err);
      throw new HttpException(
        err?.message || 'Failed to add member',
        err?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('get/:id')
  async getOrg(@Param('id') id: string) {
    try {
      const response = await firstValueFrom(
        this.orgClient.send('get_organization', id),
      );
      return response;
    } catch (err) {
      console.error('Error fetching organization:', err);
      throw new HttpException(
        err?.message || 'Failed to fetch organization',
        err?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/members/:id')
  async getMembers(@Param('id') id: string) {
    try {
      const response = await firstValueFrom(
        this.orgClient.send('get_organization_members', id),
      );
      return response;
    } catch (err) {
      console.error('Error fetching members:', err);
      throw new HttpException(
        err?.message || 'Failed to fetch organization members',
        err?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/teams:id')
  async createTeam(@Param('id') orgId: string, @Body() body: any) {
    try {
      const payload = { organizationId: orgId, ...body };
      const response = await firstValueFrom(
        this.orgClient.send('create_team', payload),
      );
      return response;
    } catch (err) {
      console.error('Error creating team:', err);
      throw new HttpException(
        err?.message || 'Failed to create team',
        err?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('teams/members/:teamId')
  async addTeamMember(@Param('teamId') teamId: string, @Body() body: any) {
    try {
      const payload = { teamId, ...body };
      const response = await firstValueFrom(
        this.orgClient.send('add_team_member', payload),
      );
      return response;
    } catch (err) {
      console.error('Error adding team member:', err);
      throw new HttpException(
        err?.message || 'Failed to add team member',
        err?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('teams/members/teamId')
  async getTeamMembers(@Param('teamId') teamId: string) {
    try {
      const response = await firstValueFrom(
        this.orgClient.send('get_team_members', teamId),
      );
      return response;
    } catch (err) {
      console.error('Error fetching team members:', err);
      throw new HttpException(
        err?.message || 'Failed to fetch team members',
        err?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
