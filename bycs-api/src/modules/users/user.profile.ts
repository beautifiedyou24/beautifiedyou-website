import { Mapper, MappingProfile, createMap, forMember, mapFrom } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { User } from "./models/user.model";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserResponseDto } from "./dto/user-response.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, CreateUserDto, User);
      createMap(mapper, UpdateUserDto, User);
      createMap(
        mapper,
        User,
        UserResponseDto,
        forMember(
          (destination) => destination.roles,
          mapFrom((source) => source.roles),
        ),
      );
    };
  }
}
