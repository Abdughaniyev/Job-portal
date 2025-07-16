import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from '../entities/job.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {}

  async search(query: {
    title: string;
    salary?: string;
    category?: string;
    lang?: 'en' | 'ru' | 'uz';
  }) {
    const { title, salary, category, lang = 'en' } = query;

    // Map language to the correct column in the Job entity
    const titleColumnMap: Record<'en' | 'ru' | 'uz', string> = {
      en: 'job.titleEn',
      ru: 'job.titleRu',
      uz: 'job.titleUz',
    };

    const titleColumn = titleColumnMap[lang];

    const qb = this.jobRepository.createQueryBuilder('job');

    qb.where(`LOWER(${titleColumn}) LIKE LOWER(:title)`, {
      title: `%${title.trim()}%`,
    });

    if (salary?.trim()) {
      qb.andWhere('job.salary = :salary', { salary: salary.trim() });
    }

    if (category?.trim()) {
      qb.andWhere('LOWER(job.jobCategory) LIKE LOWER(:category)', {
        category: `%${category.trim()}%`,
      });
    }

    const jobs = await qb.getMany();

    if (!jobs.length) {
      throw new NotFoundException('No jobs matched your search.');
    }

    return jobs;
  }
}
