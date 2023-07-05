import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Status } from '@prisma/client';

@ObjectType()
export class Task {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  dueDate: string;

  @Field()
  status: Status;

  @Field({ nullable: true })
  description: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
