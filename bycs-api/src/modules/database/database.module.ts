import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { addGlobalVirtuals } from "./plugins/global-virtuals.plugin";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        mongoose.plugin(addGlobalVirtuals);
        const uri = configService.getOrThrow<string>("DATABASE_URL");
        return { uri };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
