import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Job } from "../entities/job.entity";
import { Injectable, NotFoundException } from "@nestjs/common";


@Injectable()
export class SearchService {
    constructor(@InjectRepository(Job) private readonly jobRepository: Repository<Job>) { }

   async search(query: { title?: string; salary?: string; jobCategory?: string }) {
  const qb = this.jobRepository.createQueryBuilder('job');

  if (!query.title && !query.salary && !query.jobCategory) {
    throw new NotFoundException('At least one search parameter is required.');
  }

  if (query.title?.trim()) {
    qb.andWhere('LOWER(job.jobTitle) LIKE LOWER(:title)', {
      title: `%${query.title.trim()}%`,
    });
  }

  if (query.salary) {
    qb.andWhere('job.salary = :salary', { salary: query.salary });
  }

  if (query.jobCategory?.trim()) {
    qb.andWhere('LOWER(job.jobCategory) LIKE LOWER(:jobCategory)', {
      jobCategory: `%${query.jobCategory.trim()}%`,
    });
  }

  const jobs = await qb.getMany();

  if (jobs.length === 0) {
    throw new NotFoundException('No jobs matched your search.');
  }

  return jobs;
}

}


