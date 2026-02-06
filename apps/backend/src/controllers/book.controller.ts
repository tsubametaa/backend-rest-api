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
  Query,
} from '@nestjs/common';
import { BukuService } from '../services/book.service';
import { CreateBukuDto, UpdateBukuDto } from '../dto/book.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Buku } from '../entities/book.entity';

@Controller('buku')
@UseGuards(JwtAuthGuard)
export class BukuController {
  constructor(private readonly bukuService: BukuService) {}

  @Get()
  findAll(@Query('penulisId') penulisId?: string): Promise<Buku[]> {
    if (penulisId) {
      return this.bukuService.findByPenulis(penulisId);
    }
    return this.bukuService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Buku> {
    return this.bukuService.findOne(id);
  }

  @Post()
  create(@Body() createBukuDto: CreateBukuDto): Promise<Buku> {
    return this.bukuService.create(createBukuDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBukuDto: UpdateBukuDto,
  ): Promise<Buku> {
    return this.bukuService.update(id, updateBukuDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.bukuService.remove(id);
  }
}
