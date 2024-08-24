import { AuthModule } from "@auth/auth.module";
import { classes } from "@automapper/classes";
import { AutomapperModule } from "@automapper/nestjs";
import { CartModule } from "@carts/cart.module";
import { CategoryModule } from "@categories/category.module";
import { DatabaseModule } from "@database/database.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { OrderModule } from "@orders/order.module";
import { ProductModule } from "@products/product.module";
import { UserModule } from "@users/user.module";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { ResponseInterceptor } from "./interceptors/response.interceptor";
import { RoleGuard } from "./guards/role.guard";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    DatabaseModule,
    UserModule,
    ProductModule,
    CategoryModule,
    CartModule,
    OrderModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
