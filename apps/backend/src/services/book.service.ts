import { Injectable, NotFoundException } from '@nestjs/common';
import { supabase } from '../config/supabase.config';
import { CreateBukuDto, UpdateBukuDto } from '../dto/book.dto';

@Injectable()
export class BukuService {
  async findAll(): Promise<any[]> {
    const { data, error } = await supabase.from('buku').select('*, penulis(*)');

    if (error) {
      throw new Error('Gagal mengambil data buku: ' + error.message);
    }

    return data;
  }

  async findOne(id: string): Promise<any> {
    const { data, error } = await supabase
      .from('buku')
      .select('*, penulis(*)')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Buku dengan ID ${id} tidak ditemukan`);
    }

    return data;
  }

  async findByPenulis(penulisId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('buku')
      .select('*, penulis(*)')
      .eq('penulis_id', penulisId);

    if (error) {
      throw new Error(
        'Gagal mengambil buku berdasarkan penulis: ' + error.message,
      );
    }

    return data;
  }

  async create(createBukuDto: CreateBukuDto): Promise<any> {
    const { data, error } = await supabase
      .from('buku')
      .insert({
        judul: createBukuDto.judul,
        isbn: createBukuDto.isbn,
        tahun_terbit: createBukuDto.tahunTerbit,
        penulis_id: createBukuDto.penulisId,
      })
      .select('*, penulis(*)')
      .single();

    if (error) {
      throw new Error('Gagal membuat buku: ' + error.message);
    }

    return data;
  }

  async update(id: string, updateBukuDto: UpdateBukuDto): Promise<any> {
    await this.findOne(id);

    const updateData: any = {};
    if (updateBukuDto.judul) updateData.judul = updateBukuDto.judul;
    if (updateBukuDto.isbn) updateData.isbn = updateBukuDto.isbn;
    if (updateBukuDto.tahunTerbit)
      updateData.tahun_terbit = updateBukuDto.tahunTerbit;
    if (updateBukuDto.penulisId)
      updateData.penulis_id = updateBukuDto.penulisId;

    const { data, error } = await supabase
      .from('buku')
      .update(updateData)
      .eq('id', id)
      .select('*, penulis(*)')
      .single();

    if (error) {
      throw new Error('Gagal update buku: ' + error.message);
    }

    return data;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    const { error } = await supabase.from('buku').delete().eq('id', id);

    if (error) {
      throw new Error('Gagal menghapus buku: ' + error.message);
    }
  }
}
