import { Injectable } from "@nestjs/common";
import { JobsService } from "src/modules/jobs/jobs.service";
import { UsersService } from "../users/users.service";
import { ApplicationsService } from "src/modules/applications/applications.service";
import { ResData } from "src/lib/resData";

@Injectable()
export class DashboardService {

    constructor(
        private readonly jobsService: JobsService,
        private readonly usersService: UsersService,
        private readonly applicationsService: ApplicationsService,
    ) { }
    
    async getSummary() {
        const totalUsers = await this.usersService.countUsers()
        const totalApplications = await this.applicationsService.countApplication()
        const totalJobs = await this.jobsService.countJobs()

        return new ResData('Total information has been sent successfully!', 200, { totalUsers, totalJobs, totalApplications })
    }
}