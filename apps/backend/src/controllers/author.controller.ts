import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
  Request,
} from '@nestjs/common';
import { PenulisService } from '../services/author.service';
import { CreatePenulisDto, UpdatePenulisDto } from '../dto/author.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Penulis } from '../entities/author.entity';

@Controller('penulis')
@UseGuards(JwtAuthGuard)
export class PenulisController {
  constructor(private readonly penulisService: PenulisService) {}

  @Get()
  findAll(): Promise<Penulis[]> {
    return this.penulisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Penulis> {
    return this.penulisService.findOne(id);
  }

  @Post()
  create(
    @Body() createPenulisDto: CreatePenulisDto,
    @Request() req: any,
  ): Promise<Penulis> {
    return this.penulisService.create(createPenulisDto, req.user?.id);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePenulisDto: UpdatePenulisDto,
  ): Promise<Penulis> {
    return this.penulisService.update(id, updatePenulisDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.penulisService.remove(id);
  }
}
