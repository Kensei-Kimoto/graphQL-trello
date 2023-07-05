import { Field, InputType, Int } from '@nestjs/graphql';
import { IsDateString, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateTaskInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsDateString()
  dueDate: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int)
  userId: number;
}
