import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../users/jwt/auth-guard";
import { RolesGuard } from "../users/roles/roles.guard";
import { Roles } from "../users/roles/roles.decorator";
import { DashboardService } from "./dashboard.service";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@Roles('admin')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('summary')
    getSummary() {
        return this.dashboardService.getSummary()
    }

}