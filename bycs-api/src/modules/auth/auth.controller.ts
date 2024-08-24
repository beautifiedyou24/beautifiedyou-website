import { Body, Controller, Delete, HttpStatus, Logger, Post } from "@nestjs/common";

import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";

import { Public } from "@decorators/public.decorator";
import { ResponseMessage } from "@decorators/response-message.decorator";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { SignupDto } from "./dto/signup.dto";
import { TokenDto } from "./dto/token.dto";

@ApiTags("auth")
@ApiBearerAuth()
@Controller({
  path: "auth",
  version: "1",
})
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("signup")
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  @ApiBody({
    type: SignupDto,
  })
  @ResponseMessage("Account created successfully", HttpStatus.CREATED)
  async signup(@Body() signupDto: SignupDto): Promise<void> {
    return await this.authService.signup(signupDto);
  }

  @Public()
  @Post("login")
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: TokenDto,
  })
  @ApiBody({
    type: LoginDto,
  })
  @ResponseMessage("Logged in successfully", HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<TokenDto> {
    return await this.authService.login(loginDto);
  }

  @Delete("logout")
  async logout() {}
}
