import { Injectable, NotFoundException } from '@nestjs/common';
import { supabase } from '../config/supabase.config';
import { CreatePenulisDto, UpdatePenulisDto } from '../dto/author.dto';

@Injectable()
export class PenulisService {
  async findAll(): Promise<any[]> {
    const { data, error } = await supabase.from('penulis').select('*, buku(*)');

    if (error) {
      throw new Error('Gagal mengambil data penulis: ' + error.message);
    }

    return data.map((p) => ({
      ...p,
      bukuList: p.buku || [],
    }));
  }

  async findOne(id: string): Promise<any> {
    const { data, error } = await supabase
      .from('penulis')
      .select('*, buku(*)')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Penulis dengan ID ${id} tidak ditemukan`);
    }

    return {
      ...data,
      bukuList: data.buku || [],
    };
  }

  async create(
    createPenulisDto: CreatePenulisDto,
    userId?: string,
  ): Promise<any> {
    const { data, error } = await supabase
      .from('penulis')
      .insert({
        nama: createPenulisDto.nama,
        bio: createPenulisDto.bio,
        created_by: userId,
      })
      .select()
      .single();

    if (error) {
      throw new Error('Gagal membuat penulis: ' + error.message);
    }

    return data;
  }

  async update(id: string, updatePenulisDto: UpdatePenulisDto): Promise<any> {
    await this.findOne(id);

    const { data, error } = await supabase
      .from('penulis')
      .update({
        nama: updatePenulisDto.nama,
        bio: updatePenulisDto.bio,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error('Gagal update penulis: ' + error.message);
    }

    return data;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    const { error } = await supabase.from('penulis').delete().eq('id', id);

    if (error) {
      throw new Error('Gagal menghapus penulis: ' + error.message);
    }
  }
}
