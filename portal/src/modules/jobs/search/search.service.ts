import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from '../entities/job.entity';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) { }

  async search(query: {
    title: string;
    salary?: string;
    jobCategory?: string;
    lang?: 'en' | 'ru' | 'uz';
  }) {
    const { title, salary, jobCategory, lang = 'en' } = query;

    const qb = this.jobRepository.createQueryBuilder('job');

    const titleField = {
      en: 'job.title_en',
      ru: 'job.title_ru',
      uz: 'job.title_uz',
    }[lang];

    qb.andWhere(`LOWER(${titleField}) LIKE LOWER(:title)`, {
      title: `%${title.trim()}%`,
    });

    if (salary) {
      qb.andWhere('job.salary = :salary', { salary });
    }

    if (jobCategory?.trim()) {
      qb.andWhere('LOWER(job.job_category) LIKE LOWER(:jobCategory)', {
        jobCategory: `%${jobCategory.trim()}%`,
      });
    }

    const jobs = await qb.getMany();

    if (!jobs.length) {
      throw new NotFoundException('No jobs matched your search.');
    }

    return jobs;
  }
}
