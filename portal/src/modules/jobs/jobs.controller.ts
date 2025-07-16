import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JwtAuthGuard } from '../users/jwt/auth-guard';
import { Roles } from '../users/roles/roles.decorator';
import { RolesGuard } from '../users/roles/roles.guard';
import { RequestWithUser } from '../users/jwt/request-with-user.interface';
import { PaginationDto } from 'src/lib/paginationGeneral.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@Controller('jobs')
export class JobsController {

  constructor(private readonly jobsService: JobsService) { }

  // Recruiters can create a new job post
  @Roles('recruiter')
  @Post('/create-job')
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createJobDto: CreateJobDto, @Req() req: RequestWithUser) {
    const recruiterId = req.user.userId
    return this.jobsService.create(createJobDto, recruiterId);
  }

  // Admin can view all jobs
  @Roles('admin', 'jobseeker', 'recruiter')
  @Get('/all-jobs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll(@Query() pagination: PaginationDto) {
    return this.jobsService.findAll(pagination);
  }

  // Anyone (authenticated user) can view a specific job post
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  // Recruiters can update their own job postings
  @Roles('recruiter')
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @Req() req: RequestWithUser) {
    const recruiterId = req.user.userId
    return this.jobsService.update(id, updateJobDto, recruiterId);
  }

  // Recruiters can delete their own job postings
  @Roles('recruiter')
  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    const recruiterId = req.user.userId
    return this.jobsService.remove(id, recruiterId);
  }
}
