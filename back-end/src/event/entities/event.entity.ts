import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('event')
export class Event {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'timestamp', default: null, nullable: true })
  eventTime: Date;

  @Column({ type: 'varchar', length: 255 })
  eventName: string;

  @Column({ type: 'varchar', length: 255, default: null, nullable: true })
  licensePlate: string;

  @Column({ type: 'varchar', length: 255, default: null, nullable: true })
  position: string;

  @Column({ type: 'varchar', length: 2550 })
  info: string;

  @Column({ type: 'varchar', length: 255, default: null, nullable: true })
  cameraId: string;
}
