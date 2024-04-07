export class CreateEventDto {
  eventTime: Date;

  eventName: string;

  licensePlate?: string;

  position?: string;

  info: string;

  cameraId?: string;
}
