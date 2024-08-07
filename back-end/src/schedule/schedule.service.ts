import 'dotenv/config';
import axios from 'axios';
import { CronJob } from 'cron';
import { Injectable, Inject, forwardRef, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventService } from '../event/event.service';

@Injectable()
export class ScheduleService implements OnModuleInit {
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
    await axios.get(process.env.PY_IP + '/api/v1/check_alert');
  }

  async scheduleCronJobs() {
    try {
      const { data: { results = {} } = {} } = await axios.get(
        process.env.PY_IP + '/api/v1/allConfig',
      );
      const { isAlert, alertFrequency, alertTime } = results;
      if (isAlert === '1') {
        const times = alertTime
          ?.split(',')
          .map((t: string) => alertFrequency + '_' + t);
        times.forEach((t: keyof CronExpression) => {
          const cronJob = new CronJob(
            CronExpression[t],
            this.checkAlert.bind(this),
          );
          cronJob.start();
        });
      }
    } catch (error) {
      console.error('Error scheduling cron jobs:', error);
    }
  }

  async onModuleInit() {
    await this.scheduleCronJobs();
  }
}
