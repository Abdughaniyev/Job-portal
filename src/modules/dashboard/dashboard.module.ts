import { Module } from "@nestjs/common";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";
import { JobsModule } from "src/modules/jobs/jobs.module";
import { UsersModule } from "src/modules/users/users.module";
import { ApplicationsModule } from "src/modules/applications/applications.module";


@Module({
    imports:[JobsModule,UsersModule, ApplicationsModule],
    controllers: [DashboardController],
    providers: [DashboardService]
})



export class DashboardModule { }
