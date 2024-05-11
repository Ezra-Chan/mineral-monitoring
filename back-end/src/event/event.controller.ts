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
    try {
      const [cameraId, position, time] = text.split(',');
      const eventName = text.substring(text.lastIndexOf(',') + 1);
      const regex =
        /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2}\.\d{6})([+-]\d{4})$/;
      let date = time;
      const match = time.match(regex);
      if (match) {
        const [, year, month, day, hour, minute, second] = match;
        date = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
      }
      return this.eventService.create({
        eventTime: new Date(date),
        eventName,
        position,
        cameraId,
        info: text,
      });
    } catch (error) {
      return this.eventService.create({
        eventTime: new Date(),
        eventName: '出错了',
        info: text,
      });
    }
  }

  @Post('list')
  findAll(@Body() params) {
    return this.eventService.findAll(params);
  }
}
