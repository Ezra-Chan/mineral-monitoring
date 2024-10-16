import {
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
  In,
  FindManyOptions,
  FindOptionsWhere,
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
    const {
      cameraId,
      eventTime,
      size = 100,
      pageSize = 100,
      pageNo = 1,
      types,
    } = params;
    let filter: FindOptionsWhere<Event> = {};
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
    const count: { [key: string]: number } = {};
    if (types) {
      types.forEach(async (type: string) => {
        const typeFilter = {
          ...filter,
          eventName: type,
        };
        const options: FindManyOptions = {
          where: typeFilter,
          order: {
            eventTime: 'DESC',
          },
        };
        count[type] = await this.eventRepository.count(options);
      });
    }
    const options: FindManyOptions = {
      where: filter,
      order: {
        eventTime: 'DESC',
      },
      skip: (pageNo - 1) * pageSize,
      take: pageSize,
    };
    if (!eventTime) {
      options.take = size; // 老版本需要
    }
    const [events, total] = await this.eventRepository.findAndCount(options);
    if (eventTime && total < size) {
      let newFilter: FindOptionsWhere<Event> = {};
      if (cameraId) {
        newFilter = { cameraId: filter.cameraId };
      }
      const e = await this.eventRepository.find({
        where: newFilter,
        order: {
          eventTime: 'DESC',
        },
        take: size,
      });
      return eventTime
        ? {
            events: e,
            total,
            count,
          }
        : events;
    } else {
      return eventTime ? { events, total, count } : events;
    }
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
