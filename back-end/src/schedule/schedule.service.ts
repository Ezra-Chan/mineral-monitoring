import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { YourRepository } from 'path-to-your-repository';

@Injectable()
export class ScheduleService {
  constructor(private readonly yourRepository: YourRepository) {} // 替换为你的实际仓库

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // 在这里执行删除一个月前数据的操作
    await this.yourRepository.delete({
      createdAt: {
        $lt: oneMonthAgo,
      },
    });
  }
}
