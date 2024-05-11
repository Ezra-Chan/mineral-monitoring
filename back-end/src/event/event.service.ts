import { LessThanOrEqual, Repository, In } from 'typeorm';
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

  async findAll(params: any) {
    const { cameraId } = params;
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
    return await this.eventRepository.find({
      where: filter,
      order: {
        eventTime: 'DESC',
      },
      take: params.size ?? 100,
    });
  }

  async deleteByTime(eventTime: Date) {
    return await this.eventRepository.delete({
      eventTime: LessThanOrEqual(eventTime),
    });
  }
}
