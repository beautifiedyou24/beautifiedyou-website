import { IBaseService } from "@common/interfaces/base-service.interface";
import { CreateUserDto } from "@users/dto/create-user.dto";
import { PaginatedUserResponseDto } from "@users/dto/paginated-user-response.dto";
import { UpdateUserDto } from "@users/dto/update-user.dto";
import { UserQueryDto } from "@users/dto/user-query.dto";
import { UserResponseDto } from "@users/dto/user-response.dto";
import { User } from "@users/models/user.model";

export interface IUserService extends IBaseService<User, CreateUserDto, UpdateUserDto, UserResponseDto> {
  isEmailExist(email: string): Promise<boolean>;
  createOneUser(createDto: CreateUserDto): Promise<UserResponseDto>;
  findAllUser(query: UserQueryDto): Promise<PaginatedUserResponseDto>;
}
