import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Job } from "../jobs/entities/job.entity";
import { Injectable, NotFoundException } from "@nestjs/common";


@Injectable()
export class SearchService {
    constructor(@InjectRepository(Job) private readonly jobRepository: Repository<Job>) { }

    async search(search?: string) {
        const query = this.jobRepository.createQueryBuilder('job')
        if (search) {
            query.where('LOWER(job.title) LIKE :search', { search: `%${search.toLowerCase()}%` })
        }
        
        return query.getMany()
    }
}


