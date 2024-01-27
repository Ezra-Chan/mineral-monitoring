import * as rawbody from 'raw-body';
import { Controller, Get, Post, Body, Header, Req } from '@nestjs/common';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Header('Content-Type', 'text/plain') // 设置响应的内容类型为text/plain
  @Post()
  async create(@Req() req: any, @Body() data: string) {
    let text = data;
    if (req.readable) {
      // body is ignored by NestJS -> get raw body from request
      const raw = await rawbody(req);
      text = raw.toString().trim();
    }
    const [ip, time, eventName] = text.split(',');
    return this.eventService.create({
      eventTime: new Date(time),
      eventName,
    });
  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }
}
