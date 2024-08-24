import { Controller, Get, Post, Body, Param, Delete, Logger, HttpStatus, Put, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserResponseDto } from "./dto/user-response.dto";
import { ApiTags, ApiBearerAuth, ApiResponse, ApiBody } from "@nestjs/swagger";
import { UserQueryDto } from "./dto/user-query.dto";
import { PaginatedUserResponseDto } from "./dto/paginated-user-response.dto";
import { UrlParameterPipe } from "src/pipes/url-parameter.pipe";
import { ResponseMessage } from "@decorators/response-message.decorator";
import { Roles } from "@decorators/role.decorator";
import { Role } from "./enums/role.enum";

@ApiTags("users")
@ApiBearerAuth()
@Controller({
  path: "users",
  version: "1",
})
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: UserResponseDto,
  })
  @ApiBody({
    type: CreateUserDto,
  })
  @Roles([Role.Admin])
  @ResponseMessage("Created", HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return await this.userService.createOneUser(createUserDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: PaginatedUserResponseDto,
  })
  async findAll(@Query() query: UserQueryDto): Promise<PaginatedUserResponseDto> {
    return await this.userService.findAllUser(query);
  }

  @Get(":id")
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponseDto,
  })
  async findOne(@Param("id", UrlParameterPipe) id: string): Promise<UserResponseDto> {
    return this.userService.findOneById(id);
  }

  @Put(":id")
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponseDto,
  })
  @ApiBody({
    type: UpdateUserDto,
  })
  async update(
    @Param("id", UrlParameterPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return await this.userService.updateOne(id, updateUserDto);
  }

  @Delete(":id")
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @ResponseMessage("User deleted successfully", HttpStatus.NO_CONTENT)
  async remove(@Param("id", UrlParameterPipe) id: string): Promise<boolean> {
    return await this.userService.deleteOne(id);
  }
}
