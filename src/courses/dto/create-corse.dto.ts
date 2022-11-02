import { IsString } from 'class-validator';

export class CreateCorseDto {
  @IsString()
  readonly name: string;
  @IsString()
  readonly description: string;
  @IsString({ each: true })
  readonly tags: string[];
}
