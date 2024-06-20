import { Injectable, Inject, forwardRef } from '@nestjs/common';
import axios from 'axios';
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

  async checkAlert() {
    await axios.get('http://localhost:5000/api/v1/check_alert');
  }

  // 每天上午8点和下午8点执行
  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async handleCron2() {
    await this.checkAlert();
  }

  @Cron(CronExpression.EVERY_DAY_AT_8PM)
  async handleCron3() {
    await this.checkAlert();
  }
}
