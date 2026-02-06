import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
      message: 'Perpustakaan API',
      version: '1.0.0',
      endpoints: {
        auth: '/api/auth/login, /api/auth/register',
        penulis: '/api/penulis',
        buku: '/api/buku',
      },
    };
  }
}
