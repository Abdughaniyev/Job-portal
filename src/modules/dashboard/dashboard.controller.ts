import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../users/jwt/auth-guard";
import { RolesGuard } from "../users/roles/roles.guard";
import { Roles } from "../users/roles/roles.decorator";
import { DashboardService } from "./dashboard.service";

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('summary')
    getSummary() {
        return this.dashboardService.getSummary()
    }

}