import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Perpustakaan API (e2e)', () => {
  let app: INestApplication<App>;
  let accessToken: string;
  let createdPenulisId: string;
  let createdBukuId: string;

  const testUser = {
    email: `uta@buku.com`,
    password: 'Admin123',
  };

  const testPenulis = {
    nama: 'Alif',
    bio: 'Penulis novel Jerman terkenal dengan karya-karyanya.',
  };

  const testBuku = {
    judul: 'Buku belajar javascript',
    isbn: `ISBN${Date.now()}`,
    tahunTerbit: 2023,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication', () => {
    it('/api/auth/register (POST) - harus mendaftarkan user baru', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      accessToken = response.body.access_token;
    });

    it('/api/auth/register (POST) - harus gagal dengan email duplikat', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send(testUser)
        .expect(409);
    });

    it('/api/auth/login (POST) - harus login sukses', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
      accessToken = response.body.access_token;
    });

    it('/api/auth/login (POST) - harus gagal dengan password salah', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'passwordsalah',
        })
        .expect(401);
    });
  });

  describe('Penulis CRUD', () => {
    it('/api/penulis (GET) - harus gagal tanpa token', () => {
      return request(app.getHttpServer()).get('/api/penulis').expect(401);
    });

    it('/api/penulis (POST) - harus membuat penulis', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/penulis')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(testPenulis)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.nama).toBe(testPenulis.nama);
      createdPenulisId = response.body.id;
    });

    it('/api/penulis (GET) - harus mendapatkan semua penulis', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/penulis')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('/api/penulis/:id (GET) - harus mendapatkan penulis berdasarkan id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/penulis/${createdPenulisId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.id).toBe(createdPenulisId);
      expect(response.body.nama).toBe(testPenulis.nama);
    });

    it('/api/penulis/:id (PUT) - harus update penulis', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/penulis/${createdPenulisId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ bio: 'Bio yang diperbarui' })
        .expect(200);

      expect(response.body.bio).toBe('Bio yang diperbarui');
    });
  });

  describe('Buku CRUD', () => {
    it('/api/buku (GET) - harus gagal tanpa token', () => {
      return request(app.getHttpServer()).get('/api/buku').expect(401);
    });

    it('/api/buku (POST) - harus membuat buku', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/buku')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          ...testBuku,
          penulisId: createdPenulisId,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.judul).toBe(testBuku.judul);
      createdBukuId = response.body.id;
    });

    it('/api/buku (GET) - harus mendapatkan semua buku', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/buku')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('/api/buku?penulisId (GET) - harus mendapatkan buku berdasarkan penulis', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/buku?penulisId=${createdPenulisId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0].penulis_id).toBe(createdPenulisId);
    });

    it('/api/buku/:id (GET) - harus mendapatkan buku berdasarkan id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/buku/${createdBukuId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.id).toBe(createdBukuId);
      expect(response.body.judul).toBe(testBuku.judul);
    });

    it('/api/buku/:id (PUT) - harus update buku', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/buku/${createdBukuId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ tahunTerbit: 1998 })
        .expect(200);

      expect(response.body.tahun_terbit).toBe(1998);
    });

    it('/api/buku/:id (DELETE) - harus hapus buku', () => {
      return request(app.getHttpServer())
        .delete(`/api/buku/${createdBukuId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });
  });

  describe('Pembersihan', () => {
    it('/api/penulis/:id (DELETE) - harus hapus penulis', () => {
      return request(app.getHttpServer())
        .delete(`/api/penulis/${createdPenulisId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });
  });

  describe('Validasi Token', () => {
    it('harus menolak token tidak valid', () => {
      return request(app.getHttpServer())
        .get('/api/penulis')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('harus menolak token expired/malformed', () => {
      return request(app.getHttpServer())
        .get('/api/buku')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U',
        )
        .expect(401);
    });
  });
});
