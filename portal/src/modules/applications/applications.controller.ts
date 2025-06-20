import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, Query, } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { JwtAuthGuard } from '../users/jwt/auth-guard';
import { Roles } from '../users/roles/roles.decorator';
import { RolesGuard } from '../users/roles/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import * as fs from 'fs';
import { PaginationDto } from 'src/lib/paginationGeneral.dto';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService
  ) { }

  // Jobseekers can create applications
  @Roles('jobseeker')
  @Post('/create-application')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/resumes';
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }

          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.floor(Math.random() * 1000000);
          const fileExtension = extname(file.originalname);
          cb(null, uniqueName + fileExtension);
        },
      }),
      fileFilter: (req, file, cb) => {
        const isPdf = file.mimetype === 'application/pdf';
        cb(isPdf ? null : new Error('Only pdf files are allowed!'), isPdf);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    })
  )

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', format: 'uuid' },
        applicantId: { type: 'string', format: 'uuid' },
        coverLetterEn: {
          type: 'string',
          example: "I'm excited to apply for the Frontend Developer role..."
        },
        coverLetterRu: {
          type: 'string',
          example: "Я рад подать заявку на должность Frontend-разработчика..."
        },
        coverLetterUz: {
          type: 'string',
          example: "Frontend dasturchi lavozimiga ariza topshirishdan mamnunman..."
        },
        file: {
          type: 'string',
          format: 'binary'
        }
      },
      required: ['jobId', 'applicantId', 'file']
    }

  })
  create(
    @Body() createApplicationDto: CreateApplicationDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    const fileUrl = file ? `${process.env.BASE_URL}/resumes/${file.filename}` : undefined
    return this.applicationsService.create(createApplicationDto, fileUrl);
  }


  // Jobseekers can view all their applications
  @Roles('jobseeker')
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll(@Query() pagination: PaginationDto) {
    return this.applicationsService.findAll(pagination);
  }

  // Admins and Jobseekers can view a specific application by ID
  @Roles('jobseeker', 'admin')
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }




  // Jobseekers can update their own applications
  @Roles('jobseeker')
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/resumes';
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }

          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.floor(Math.random() * 1000000);
          const fileExtension = extname(file.originalname);
          cb(null, uniqueName + fileExtension);
        },
      }),
      fileFilter: (req, file, cb) => {
        const isPdf = file.mimetype === 'application/pdf';
        cb(isPdf ? null : new Error('Only pdf files are allowed!'), isPdf);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    })
  )

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', format: 'uuid' },
        applicantId: { type: 'string', format: 'uuid' },
        coverLetterEn: {
          type: 'string',
          example: "I'm excited to apply for the Frontend Developer role..."
        },
        coverLetterRu: {
          type: 'string',
          example: "Я рад подать заявку на должность Frontend-разработчика..."
        },
        coverLetterUz: {
          type: 'string',
          example: "Frontend dasturchi lavozimiga ariza topshirishdan mamnunman..."
        },
        file: {
          type: 'string',
          format: 'binary'
        }
      },
      required: ['jobId', 'applicantId', 'file']
    }
  })
  update(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
    @UploadedFile() file: Express.Multer.File) {
    const fileUrl = file ? `${process.env.BASE_URL}/resumes/${file.filename}` : undefined
    return this.applicationsService.update(id, updateApplicationDto, fileUrl);
  }

  @Roles('recruiter')
  @Patch('status/accept/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  acceptApplication(@Param('id') id: string) {
    return this.applicationsService.acceptApplication(id)
  }

  @Roles('recruiter')
  @Patch("status/reject/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  rejectApplication(@Param('id') id: string) {
    return this.applicationsService.rejectApplication(id)
  }


  // Admins can delete any application
  @Roles('admin')
  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.applicationsService.remove(id);
  }
}
