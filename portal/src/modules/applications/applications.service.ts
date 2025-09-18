import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { MoreThan, Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { ResData } from 'src/lib/resData';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationStatusEnum } from 'src/common/enums/application-status';
import { join } from 'path';
import * as fs from 'fs'
import { MailService } from '../users/nodemailer/nodemailer.service';
import { PaginationDto } from 'src/lib/paginationGeneral.dto';
@Injectable()
export class ApplicationsService {
  constructor(@InjectRepository(Application)
  private readonly appRepository: Repository<Application>) { }

  async create(createApplicationDto: CreateApplicationDto, fileUrl: string | undefined) {
    const daysLimit = 7;
    const dateLimit = new Date()
    dateLimit.setDate(dateLimit.getDate() - daysLimit)

    const application = await this.appRepository.findOne(
      {
        where: [
          {
            coverLetterEn: createApplicationDto.coverLetterEn,
            job: { id: createApplicationDto.jobId },
            applicant: { id: createApplicationDto.applicantId },
            createdAt: MoreThan(dateLimit)
          },
          {
            coverLetterRu: createApplicationDto.coverLetterRu,
            job: { id: createApplicationDto.jobId },
            applicant: { id: createApplicationDto.applicantId },
            createdAt: MoreThan(dateLimit)
          },
          {
            coverLetterUz: createApplicationDto.coverLetterUz,
            job: { id: createApplicationDto.jobId },
            applicant: { id: createApplicationDto.applicantId },
            createdAt: MoreThan(dateLimit)
          }
        ],
        relations: ['job', 'applicant']
      })

    if (application) {
      throw new ConflictException('You have already applied to this job!')
    }

    const newApplication = this.appRepository.create({
      job: { id: createApplicationDto.jobId },
      applicant: { id: createApplicationDto.applicantId },
      coverLetterEn: createApplicationDto.coverLetterEn,
      coverLetterRu: createApplicationDto.coverLetterRu,
      coverLetterUz: createApplicationDto.coverLetterUz,

      status: ApplicationStatusEnum.PENDING,
    })

    if (!fileUrl) {
      throw new NotFoundException('No file url found!')
    }
    newApplication.resume = fileUrl
    const savedApplication = await this.appRepository.save(newApplication)
    return new ResData('Application submitted successfully!', 201, savedApplication)
  }

  async findAll(pagination: PaginationDto) {
 
    const { page = 1, limit = 10 } = pagination;
    const [data, total] = await this.appRepository.findAndCount({
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

    return new ResData('All applications retrieved successfully', 200, result)
  }

  async findOne(id: string) {
    const oneApplication = await this.appRepository.findOne({ where: { id }, relations: ['applicant'] })
    if (!oneApplication) {
      throw new NotFoundException('Application not found!')
    }

    return new ResData('Application retrieved successfully', 200, oneApplication)

  }

  async acceptApplication(id: string) {
    const app = await this.appRepository.findOne({
      where: { id },
      relations: ['applicant'],
    });

    if (!app) {
      throw new NotFoundException('Application not found!')
    }

    app.status = ApplicationStatusEnum.ACCEPTED;
    await this.appRepository.save(app)
    return new ResData('Application has been accepted!', 200, { jobseeker: app.applicant })
  }


  async rejectApplication(id: string) {
    const application = await this.appRepository.findOne({
      where: { id },
      relations: ['applicant']
    })

    if (!application) {
      throw new NotFoundException('Application not found!')
    }
    application.status = ApplicationStatusEnum.REJECTED
    await this.appRepository.save(application)
    return new ResData('Application has been rejected!', 200, { jobseeker: application.applicant })
  }


  async update(id: string, updateApplicationDto: UpdateApplicationDto, updateFileUrl: string | undefined) {
    const application = await this.appRepository.findOne({ where: { id } })

    if (!application) {
      throw new NotFoundException('Application not found!')
    }

    if (!application.resume) {
      throw new NotFoundException('No file url found!')
    }

    const filePath = application.resume.replace(`${process.env.BASE_URL}`, '');
    const oldFilePath = join(__dirname, '..', '..', '..', 'uploads', filePath)

    fs.unlink(oldFilePath, (err) => {
      if (err) {
        console.warn('Failed to delete old image:', err.message)
      }
    })

    if (!updateFileUrl) {
      throw new NotFoundException('No file url found!')
    }

    const adjusted = { ...updateApplicationDto, resume: updateFileUrl }
    Object.assign(application, adjusted)
    await this.appRepository.save(application)
    return new ResData('Application has been updated successfully!', 200, application)

  }

  async remove(id: string) {
    const deletableCode = await this.appRepository.findOne({ where: { id } })
    if (!deletableCode) {
      throw new NotFoundException('Application not found!')
    }
    await this.appRepository.delete(id)
    return new ResData('Application has been deleted successfully', 200, deletableCode)


  }


  async countApplication(): Promise<number> {
    const countApplications = await this.appRepository.count()
    return countApplications;
  }



}


