import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { PrismaService } from './prisma.service'

@Module({
  controllers: [AppController],
  providers: [PrismaService],
  imports: [HttpModule],
})
export class AppModule { }
