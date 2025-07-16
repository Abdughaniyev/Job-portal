import { Controller, Get, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../../users/jwt/auth-guard';
import { Roles } from '../../users/roles/roles.decorator';
import { SearchService } from './search.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'jobseeker')
  @Get('/search-job')
  search(
    @Query('title') title?: string,
    @Query('salary') salary?: string,
    @Query('category') jobCategory?: string,
    @Query('lang') lang: 'en' | 'ru' | 'uz' = 'en',
  ) {
    if (!title || !title.trim()) {
      throw new BadRequestException('The title parameter is required.');
    }

    return this.searchService.search({ title, salary, jobCategory, lang });
  }
}
