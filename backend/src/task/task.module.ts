import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';

@Module({
  imports: [PrismaModule],
  providers: [TaskResolver, TaskService],
})
export class TaskModule {}
