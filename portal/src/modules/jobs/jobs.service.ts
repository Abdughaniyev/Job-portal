import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { MoreThan } from 'typeorm';
import { ResData } from 'src/lib/resData';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/lib/paginationGeneral.dto';



@Injectable()
export class JobsService {
  constructor(@InjectRepository(Job) private readonly jobRepository: Repository<Job>) { }

  async create(createJobDto: CreateJobDto, recruiterId: string) {
    const repostLimitDays = Number(process.env.JOB_REPOST_DAYS_LIMIT) || 7;
    const repostLimitDate = new Date()
    repostLimitDate.setDate(repostLimitDate.getDate() - repostLimitDays)
    const job = await this.jobRepository.findOne({
      where: {
        titleUz: createJobDto.titleUz,
        titleRu: createJobDto.titleRu,
        titleEn: createJobDto.titleEn,

        descriptionEn: createJobDto.descriptionEn,
        descriptionUz: createJobDto.descriptionUz,
        descriptionRu: createJobDto.descriptionRu,

        locationEn: createJobDto.locationEn,
        locationRu: createJobDto.locationRu,
        locationUz: createJobDto.locationUz,

        requirementsEn: createJobDto.requirementsEn,
        requirementsRu: createJobDto.requirementsRu,
        requirementsUz: createJobDto.requirementsUz,

        jobType: createJobDto.jobType,
        salary: createJobDto.salary,
        recruiter: { id: recruiterId },
        jobCategory: createJobDto.jobCategory,
        companyName: createJobDto.companyName,
        createdAt: MoreThan(repostLimitDate),

      },
      relations: ['recruiter'],
    })

    if (job) {
      throw new ConflictException(`You can repost this job repository after ${repostLimitDays} days`)
    }
    const newJob = this.jobRepository.create({
      titleUz: createJobDto.titleUz,
      titleRu: createJobDto.titleRu,
      titleEn: createJobDto.titleEn,

      descriptionEn: createJobDto.descriptionEn,
      descriptionUz: createJobDto.descriptionUz,
      descriptionRu: createJobDto.descriptionRu,

      locationEn: createJobDto.locationEn,
      locationRu: createJobDto.locationRu,
      locationUz: createJobDto.locationUz,

      requirementsEn: createJobDto.requirementsEn,
      requirementsRu: createJobDto.requirementsRu,
      requirementsUz: createJobDto.requirementsUz,

      jobType: createJobDto.jobType,
      salary: createJobDto.salary,
      recruiter: { id: recruiterId },
      jobCategory: createJobDto.jobCategory,
      companyName: createJobDto.companyName,



    });

    const savedJob = await this.jobRepository.save(newJob);
    return new ResData('Job has been created successfully!', 201, savedJob)

  }




  async findAll(pagination: PaginationDto) {

    const { page = 1, limit = 10 } = pagination;
    const [data, total] = await this.jobRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' }
    })

    const result = {
      data, total, page,

      lastPage: Math.ceil(total / limit),
      nextPage: page < Math.ceil(total / limit) ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    }
    return new ResData('Jobs have been found successfully', 200, result)
  }




  async findOne(id: string) {
    const oneJob = await this.jobRepository.findOne({ where: { id } })
    if (!oneJob) {
      throw new NotFoundException('Job not found!')
    }
    return new ResData('Job has been found successfully!', 200, oneJob)
  }




  async update(id: string, updateJobDto: UpdateJobDto, recruiterId: string) {

    // Ensures that the job belongs to the current recruiter (recruiterId)
    const job = await this.jobRepository.findOne({ where: { id, recruiter: { id: recruiterId } } })
    if (!job) {
      throw new NotFoundException('Job not found!')
    }
    Object.assign(job, updateJobDto);
    const updatedJob = await this.jobRepository.save(job)
    return new ResData('Job has been updated successfully!', 201, updatedJob)
  }

  async remove(id: string, recruiterId: string) {

    // Ensures that the job belongs to the current recruiter (recruiterId)
    const job = await this.jobRepository.findOne({ where: { id, recruiter: { id: recruiterId } } })
    if (!job) {
      throw new NotFoundException('Job not found!')
    }

    const removIt = await this.jobRepository.delete(id)

    return new ResData('Job has been deleted successfully!', 200, removIt)
  }

  async countJobs(): Promise<number> {
    const countJobs = await this.jobRepository.count()
    return countJobs;
  }
}
