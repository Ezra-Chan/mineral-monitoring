import {
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
  In,
  FindManyOptions,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private eventRepository: Repository<Event>,
  ) {}

  async create(createEventDto: CreateEventDto) {
    const newEvent = this.eventRepository.create(createEventDto);
    return await this.eventRepository.save(newEvent);
  }

  async findByParams(params: any) {
    const { cameraId, eventTime, size } = params;
    let filter = {};
    if (cameraId) {
      let cameras = [];
      if (Array.isArray(cameraId)) {
        cameras = cameraId;
      } else {
        cameras = [cameraId];
      }
      filter = {
        cameraId: In(cameras),
      };
    }
    if (eventTime) {
      filter = {
        ...filter,
        eventTime: MoreThanOrEqual(eventTime),
      };
    }
    const options: FindManyOptions = {
      where: filter,
      order: {
        eventTime: 'DESC',
      },
    };
    if (!eventTime) {
      options.take = size ?? 100;
    }
    return await this.eventRepository.find(options);
  }

  async findAll() {
    return await this.eventRepository.find({
      order: {
        eventTime: 'DESC',
      },
      take: 100,
    });
  }

  async deleteByTime(eventTime: Date) {
    return await this.eventRepository.delete({
      eventTime: LessThanOrEqual(eventTime),
    });
  }
}
