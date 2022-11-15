import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCorseDto } from './dto/create-corse.dto';
import { UpdateCorseDto } from './dto/update-corse.dto';
import { Course } from './entities/course.entity';
import { Tag } from './entities/tag.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  findAll() {
    return this.courseRepository.find({
      relations: ['tags']
    });
  }

  findOne(id: string) {
    const course = this.courseRepository.findOne(id, {
      relations: ['tags']
    });
    if (!course) {
      throw new NotFoundException(`Curse id ${id} not found`);
    }

    return course;
  }

  async create(createCourseDto: CreateCorseDto) {
    const tags = await Promise.all(
      createCourseDto.tags.map(name => this.preloadTagByName(name))
    )
    const course = this.courseRepository.create({
      ...createCourseDto,
      tags
    });
    return this.courseRepository.save(course);
  }

  async update(id: string, updateCourseDto: UpdateCorseDto) {
    const tags = updateCourseDto.tags && (
      await Promise.all(
        updateCourseDto.tags.map(name => this.preloadTagByName(name))
      )
    )

    const course = await this.courseRepository.preload({
      id: id,
      ...updateCourseDto,
      tags
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

  private async preloadTagByName(name: string): Promise<Tag> {
    const tag = await this.tagRepository.findOne({name})

    if(tag) {
      return tag;
    }

    return this.tagRepository.create({name});
  }
}
