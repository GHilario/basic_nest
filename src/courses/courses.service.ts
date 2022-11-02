import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCorseDto } from './dto/create-corse.dto';
import { UpdateCorseDto } from './dto/update-corse.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  findAll() {
    return this.courseRepository.find();
  }

  findOne(id: string) {
    const course = this.courseRepository.findOne(id);
    if (!course) {
      throw new NotFoundException(`Curse id ${id} not found`);
    }

    return course;
  }

  create(createCourseDto: CreateCorseDto) {
    const course = this.courseRepository.create(createCourseDto);
    return this.courseRepository.save(course);
  }

  async update(id: string, updateCourseDto: UpdateCorseDto) {
    const course = await this.courseRepository.preload({
      id: +id,
      ...updateCourseDto,
    });

    if (!course) {
      throw new NotFoundException(`Curse id ${id} not found`);
    }

    return this.courseRepository.save(course)
  }

  async remove(id: string) {
    const course = await this.courseRepository.findOne(id);
    if (!course) {
      throw new NotFoundException(`Curse id ${id} not found`);
    }

    return this.courseRepository.remove(course);
  }
}
