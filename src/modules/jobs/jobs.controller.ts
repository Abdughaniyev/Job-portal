import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JwtAuthGuard } from '../users/jwt/auth-guard';
import { Roles } from '../users/roles/roles.decorator';
import { RolesGuard } from '../users/roles/roles.guard';

@Controller('jobs')
export class JobsController {

  constructor(private readonly jobsService: JobsService) { }

  // Recruiters can create a new job post
  @Roles('recruiter')
  @Post('/create-job')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }

  // Admin and Recruiter can view all jobs (admins may want to see everything)
  @Roles('recruiter', 'admin')
  @Get('/all-jobs')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  findAll() {
    return this.jobsService.findAll();
  }

  // Anyone (authenticated user) can view a specific job post
  @Get('find-one/:id')
  // @UseGuards(JwtAuthGuard)  // No role guard since this can be viewed by anyone (e.g., jobseeker, recruiter, admin)
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  // Recruiters can update their own job postings
  @Roles('recruiter')
  @Patch(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(id, updateJobDto);
  }

  // Recruiters can delete their own job postings
  @Roles('recruiter')
  @Delete('delete/:id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.jobsService.remove(id);
  }
}
