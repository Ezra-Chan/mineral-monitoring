export class CreateEventDto {
  eventTime: Date;

  eventName: string;

  licensePlate?: string;

  detail?: string;

  info: string;
}
