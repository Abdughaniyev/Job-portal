import { Module } from "@nestjs/common";
import { SearchService } from "./search.service";
import { SearchController } from "./search.controller";
import { Job } from "../jobs/entities/job.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([Job])],
    controllers: [SearchController],
    providers: [SearchService],
})

export class SearchModule { }