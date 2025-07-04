import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../users/jwt/auth-guard";
import { Roles } from "../../users/roles/roles.decorator";
import { SearchService } from "./search.service";
import { ApiBearerAuth } from "@nestjs/swagger";

@ApiBearerAuth('access-token')
@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) { }

    @UseGuards(JwtAuthGuard)
    @Roles('admin', 'jobseeker')
    @Get('/search-job')

    search(

        @Query('title') title: string,
        @Query('salary') salary: string,
        @Query('category') jobCategory?: string,

    ) {
        return this.searchService.search({ title, salary, jobCategory });
    }

}