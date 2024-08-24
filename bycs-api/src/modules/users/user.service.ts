import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { IUserService } from "./interfaces/user-service.interface";
import { UserRepository } from "./user.repository";
import { User } from "./models/user.model";
import { UserResponseDto } from "./dto/user-response.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { BaseService } from "@common/base-service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { UserQueryDto } from "./dto/user-query.dto";
import { PaginatedUserResponseDto } from "./dto/paginated-user-response.dto";
import { LoginDto } from "@auth/dto/login.dto";
import { hashPassword, verifyPassword } from "src/utils";

@Injectable()
export class UserService
  extends BaseService<User, CreateUserDto, UpdateUserDto, UserResponseDto>
  implements IUserService
{
  constructor(
    private readonly userRepository: UserRepository,
    @InjectMapper() private readonly mapper: Mapper,
  ) {
    super(userRepository, mapper, {
      modelClass: User,
      createDtoClass: CreateUserDto,
      updateDtoClass: UpdateUserDto,
      responseDtoClass: UserResponseDto,
    });
  }

  async isEmailExist(email: string): Promise<boolean> {
    const exist = await this.userRepository.isExists({ email });
    return exist ? true : false;
  }

  async createOneUser(createDto: CreateUserDto): Promise<UserResponseDto> {
    const exist = await this.isEmailExist(createDto.email);
    if (exist) throw new ConflictException({ email: "email already in use" });

    createDto.password = await hashPassword(createDto.password);

    const user = await this.createOne(createDto);

    return user;
  }

  async findAllUser(query: UserQueryDto): Promise<PaginatedUserResponseDto> {
    const { page, limit, sortBy, sortOrder, name, phone } = query;
    const filter: any = {};
    if (name) filter.name = new RegExp(name, "i");
    if (phone) filter.phone = new RegExp(phone, "i");

    return this.paginate({ page, limit, sortBy, sortOrder, filter });
  }

  async verifyUser(loginDto: LoginDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      filter: {
        email: loginDto.email,
      },
    });

    if (!user) throw new UnauthorizedException("Invalid email or password");

    const isPasswordValid = await verifyPassword(loginDto.password, user.password);

    if (!isPasswordValid) throw new UnauthorizedException("Invalid email or password");

    return this.mapper.map<User, UserResponseDto>(user, User, UserResponseDto);
  }
}
