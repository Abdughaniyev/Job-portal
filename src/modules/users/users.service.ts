import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
      // JWT payload with necessary user data (userId, email, and role)
      const payload = {
        userId: user.id,
        email: user.email,
        role: user.role
      }
      const accessToken = jwt.sign(payload, String(process.env.JWT_ACCESS_TOKEN), { expiresIn: '15m' })
      const refreshToken = jwt.sign(payload, String(process.env.JWT_ACCESS_TOKEN), { expiresIn: '30d' })

      // removing user password for safety
      const { password, ...safeUser } = user;
      return new ResData('You have logged in successfully!', 200, { safeUser, accessToken, refreshToken },);

    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }




  async googleLogin(user: Record<string, any>) {
    const existUser = await this.userRepository.findOne({ where: { email: user.email } })

    let finalUser: User
    if (!existUser) {
      finalUser = await this.userRepository.save(user)
    }
    else {
      finalUser = existUser;
    }

    const payload = { id: finalUser.id, email: finalUser.email, role: finalUser.role }
    const accessToken = jwt.sign(payload, config.jwtAccessToken, { expiresIn: "15m" })

    return new ResData('Log in successful!', 200, accessToken)
  }


  async createUserRole(theRole: CreateUserDto) {
    const userRole = this.userRepository.create({
      ...theRole,
      role: theRole.role || RoleEnum.JOB_SEEKER,
    })

    return this.userRepository.save(userRole)
  }


  async findAll() {
    const allUsers = await this.userRepository.find()

    if (allUsers.length === 0) {
      throw new NotFoundException('Users not found!')
    }
    return new ResData('All users have been retrieved successfully!', 200, allUsers)
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


  async saveResumePath(filename: string) {
    return new ResData('Resume uploaded successfully!', 200, filename)
  }
}