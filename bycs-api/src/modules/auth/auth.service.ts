import { Injectable } from "@nestjs/common";
import { SignupDto } from "@auth/dto/signup.dto";
import { LoginDto } from "@auth/dto/login.dto";
import { UserService } from "@users/user.service";
import { JwtService } from "@nestjs/jwt";
import { TokenDto } from "./dto/token.dto";
import { Role } from "@users/enums/role.enum";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<void> {
    signupDto.roles = [Role.Customer];
    await this.userService.createOneUser(signupDto as any);
  }

  async login(loginDto: LoginDto): Promise<TokenDto> {
    const verifiedUser = await this.userService.verifyUser(loginDto);
    const jwt = this.jwtService.sign({ id: verifiedUser.id, roles: verifiedUser.roles });
    return {
      accessToken: jwt,
      user: { id: verifiedUser.id, name: verifiedUser.name, email: verifiedUser.email, roles: verifiedUser.roles },
    };
  }
}
