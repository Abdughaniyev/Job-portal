import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { MoreThan, Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { ResData } from 'src/lib/resData';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ApplicationsService {
  constructor(@InjectRepository(Application) private readonly appRepository: Repository<Application>) { }

  async create(createApplicationDto: CreateApplicationDto) {
    const daysLimit = 7;
    const dateLimit = new Date()
    dateLimit.setDate(dateLimit.getDate() - daysLimit)

    const existingApplication = await this.appRepository.findOne(
      {
        where: {
          job: { id: createApplicationDto.jobId },
          applicant: { id: createApplicationDto.applicantId },
          coverLetter: createApplicationDto.coverLetter,
          createdAt: MoreThan(dateLimit)
        },
        relations: ['job', 'applicant']
      })

    if (existingApplication) {
      throw new ConflictException('You have already applied to this job!')
    }

    const newApplication = this.appRepository.create({
      job: { id: createApplicationDto.jobId },
      applicant: { id: createApplicationDto.applicantId },
      coverLetter: createApplicationDto.coverLetter
    })

    const savedApplication = await this.appRepository.save(newApplication)

    return new ResData('Application submitted successfully!', 201, savedApplication)
  }

  async findAll() {
    const allApplications = await this.appRepository.find()
    return new ResData('All applications retrieved successfully', 200, allApplications)
  }

  async findOne(id: string) {
    const oneApplication = await this.appRepository.findOne({ where: { id } })
    if (!oneApplication) {
      throw new NotFoundException('Application not found!')
    }

    return new ResData('Application retrieved successfully', 200, oneApplication)

  }

  async update(id: string, updateApplicationDto: UpdateApplicationDto) {
    const updatableCode = await this.appRepository.findOne({ where: { id } })
    if (!updatableCode) {
      throw new NotFoundException('Application not found!')
    }

    await this.appRepository.update(id, updateApplicationDto)
    const updatedCode = await this.appRepository.findOne({ where: { id } })
    return new ResData('Application has been updated successfully!', 200, updatedCode)

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


  async saveResumePath(data: string, fileUrl: string) {

    if (!fileUrl) {
      throw new NotFoundException('Resume link not found!')
    }
    return new ResData('Resume uploaded successfully!', 200, { data, fileUrl })
  }
}


