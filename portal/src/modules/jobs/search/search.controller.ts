// search.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../users/jwt/auth-guard';
import { Roles } from '../../users/roles/roles.decorator';
import { RolesGuard } from '../../users/roles/roles.guard';
import { SearchService } from './search.service';
 import { ApiBearerAuth } from '@nestjs/swagger';
import { SearchJobDto } from './dto/search-dto';

@ApiBearerAuth('access-token')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'jobseeker')
  @Get('/search-job')
  search(@Query() query: SearchJobDto) {
    return this.searchService.search(query);
  }
}
