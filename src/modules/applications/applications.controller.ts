import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { JwtAuthGuard } from '../users/jwt/auth-guard';
import { Roles } from '../users/roles/roles.decorator';
import { RolesGuard } from '../users/roles/roles.guard';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) { }

  // Jobseekers can create applications
  @Roles('jobseeker')
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationsService.create(createApplicationDto);
  }

  // Jobseekers can view all their applications
  @Roles('jobseeker')
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll() {
    return this.applicationsService.findAll();
  }

  // Admins and Jobseekers can view a specific application by ID
  @Roles('jobseeker', 'admin')
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }

  // Jobseekers can update their own applications
  @Roles('jobseeker')
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateApplicationDto: UpdateApplicationDto) {
    return this.applicationsService.update(id, updateApplicationDto);
  }

  // Admins can delete any application
  @Roles('admin')
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.applicationsService.remove(id);
  }
}
