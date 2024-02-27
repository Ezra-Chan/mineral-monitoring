import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventService } from '../event/event.service';

@Injectable()
export class ScheduleService {
  constructor(
    @Inject(forwardRef(() => EventService))
    private readonly eventService: EventService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    // 在这里执行删除十天前数据的操作
    await this.eventService.deleteByTime(tenDaysAgo);
  }
}
