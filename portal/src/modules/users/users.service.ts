import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/general-update.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ResData } from 'src/lib/resData';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import * as  jwt from 'jsonwebtoken'
import { RoleEnum } from 'src/common/enums/roleEnum';
import { config } from 'src/common/config/config';
import { JwtPayload } from 'src/common/interfaces/jwtPayload';
import { PaginationDto } from 'src/lib/paginationGeneral.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }


  async signup(createUserDto: CreateUserDto) {
    try {

      const user = await this.userRepository.findOne({ where: { email: createUserDto.email } });
      if (user) {
        throw new ConflictException('User with this email already exists!');
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

      // Create a new user object with the hashed password
      const newUser = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
      const savedUser = await this.userRepository.save(newUser);


      // Remove password from the saved user before sending response
      const { password, ...safeUser } = savedUser;
      return new ResData('You have signed up successfully!', 201, safeUser);

    } catch (error) {
      throw new Error(error)
    }
  }


  generateAccessToken(payload: JwtPayload) {
    return jwt.sign(payload, String(process.env.JWT_ACCESS_TOKEN), { expiresIn: '15m' });
  }

  generateRefreshToken(payload: JwtPayload) {
    return jwt.sign(payload, String(process.env.JWT_REFRESH_TOKEN), { expiresIn: '30d' });
  }

  async login(createLoginUserDto: LoginUserDto) {
    try {

      const user: User | null = await this.userRepository.findOne({ where: { email: createLoginUserDto.email } });
      if (!user) {
        throw new BadRequestException('Invalid credentials: User not found!');
      }
      // Compare password with hashed password in DB
      const isMatchPassword = await bcrypt.compare(createLoginUserDto.password, user.password);

      if (!isMatchPassword) {
        throw new BadRequestException('Invalid credentials: Incorrect password!');
      }

      const payload = {
        userId: user.id,
        email: user.email,
        role: user.role
      }

      const accessToken = this.generateAccessToken(payload);
      const refreshToken = this.generateRefreshToken(payload);
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
      await this.userRepository.update(user.id, { refreshToken: hashedRefreshToken });


      // removing user password for safety
      const { password, ...safeUser } = user;
      return new ResData('You have logged in successfully!', 200, { safeUser, accessToken, refreshToken },);

    } catch (error) {
      throw new BadRequestException(error.message);
    }

  }

  async logout(userId: string, refreshTokenFromClient: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!refreshTokenFromClient) {
      throw new ForbiddenException('No refresh token provided');
    }
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('User not found or no refresh token');
    }

    const isTokenValid = await bcrypt.compare(refreshTokenFromClient, user.refreshToken);
    if (!isTokenValid) {
      throw new ForbiddenException('Invalid refresh token');
    }

    await this.userRepository.update(userId, { refreshToken: null });
    return { message: 'Logged out successfully' };
  }






  async googleLogin(user: Record<string, any>) {
    let finalUser = await this.userRepository.findOne({
      where: { email: user.email },
    });

    if (!finalUser) {
      finalUser = this.userRepository.create({
        fullName: `${user.firstName || user.given_name || ''} ${user.lastName || user.family_name || ''}`.trim(),
        email: user.email,
        password: '', // <-- or generate a random hash if password is required
        profileImage: user.picture,
        role: RoleEnum.JOB_SEEKER,
        isEmailVerified: true, // Google already verified email
      });

      finalUser = await this.userRepository.save(finalUser);
    }

    const payload = {
      userId: finalUser.id,
      email: finalUser.email,
      role: finalUser.role,
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(finalUser.id, { refreshToken: hashedRefreshToken });

    return {
      accessToken,
      refreshToken,
      user: finalUser,
    };
  }

 





  async createUserRole(theRole: CreateUserDto) {
    const userRole = this.userRepository.create({
      ...theRole,
      role: theRole.role || RoleEnum.JOB_SEEKER,
    })

    return this.userRepository.save(userRole)
  }


  async findAll(pagination: PaginationDto) {

    const { page = 1, limit = 10 } = pagination;
    const [data, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' }
    })

    if (total === 0) {
      return new ResData('No users found!', 200, {
        data: [],
        total: 0,
        page,
        lastPage: 0,
        nextPage: null,
        prevPage: null,
      });
    }

    const result = {
      data, total, page,

      lastPage: Math.ceil(total / limit),
      nextPage: page < Math.ceil(total / limit) ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,

    }


    return new ResData('All users have been retrieved successfully!', 200, result)
  }

  async findOne(id: string) {
    const oneUser = await this.userRepository.findOne({ where: { id: id } })
    if (!oneUser) {
      throw new NotFoundException('User not found!')
    }
    return new ResData('User has been found successfully!', 200, oneUser)
  }

  async update(id: string, updateUserDto: UpdateUserDto) {

    const dataUpdate = await this.userRepository.update(id, updateUserDto);

    if (dataUpdate.affected === 0) {
      throw new NotFoundException('User not found!');
    }

    const updatedUser = await this.userRepository.findOne({ where: { id } });
    if (!updatedUser) {
      throw new NotFoundException('User not found!')
    }
    const { password, ...safeUser } = updatedUser;

    return new ResData('Data has been updated successfully!', 200, safeUser);
  }


  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id: id } })
    if (!user) {
      throw new NotFoundException('User not found!')
    }
    const removedUser = await this.userRepository.delete(id)
    return new ResData('User has been deleted successfully!', 200, removedUser)
  }


  async countUsers(): Promise<number> {
    const countUsers = await this.userRepository.count()
    return countUsers;
  }


}