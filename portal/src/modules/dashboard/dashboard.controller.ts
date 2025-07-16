import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../users/jwt/auth-guard";
import { RolesGuard } from "../users/roles/roles.guard";
import { Roles } from "../users/roles/roles.decorator";
import { DashboardService } from "./dashboard.service";
import { ApiBearerAuth } from "@nestjs/swagger";

@ApiBearerAuth('access-token')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)

export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }
    @Roles('admin')
    @Get('summary')
    getSummary() {
        return this.dashboardService.getSummary()
    }

}