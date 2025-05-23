import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../users/jwt/auth-guard";
import { Roles } from "../users/roles/roles.decorator";
import { SearchService } from "./search.service";

@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) { }

    @UseGuards(JwtAuthGuard)
    @Roles('admin', 'jobseeker')
    @Get('search-job')
    search(search: string) {
        return this.searchService.search(search)
    }
  
}