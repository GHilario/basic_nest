import { PartialType } from '@nestjs/mapped-types';
import { CreateCorseDto } from './create-corse.dto';

export class UpdateCorseDto extends PartialType(CreateCorseDto) {}
