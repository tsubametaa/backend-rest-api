import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { supabase } from '../config/supabase.config';
import { RegisterDto, LoginDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async register(registerDto: RegisterDto): Promise<{ access_token: string }> {
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', registerDto.email)
      .single();

    if (existingUser) {
      throw new ConflictException('Email sudah terdaftar');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const { data: user, error } = await supabase
      .from('users')
      .insert({
        email: registerDto.email,
        password: hashedPassword,
      })
      .select()
      .single();

    if (error) {
      throw new ConflictException('Gagal mendaftarkan user: ' + error.message);
    }

    return this.generateToken(user);
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', loginDto.email)
      .single();

    if (error || !user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email atau password salah');
    }

    return this.generateToken(user);
  }

  async validateUser(userId: string): Promise<any> {
    const { data: user } = await supabase
      .from('users')
      .select('id, email, created_at')
      .eq('id', userId)
      .single();

    return user;
  }

  private generateToken(user: any): { access_token: string } {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
