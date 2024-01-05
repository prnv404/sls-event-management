export interface AttendeInterface {
  eventId: string;
  userId: string;
  registrationFee: number;
}

export class Attendee {
  eventId: string;

  userId: string;

  registrationFee: number;

  constructor(attendeeDto: AttendeInterface) {
    this.eventId = attendeeDto.eventId;
    this.userId = attendeeDto.userId;
    this.registrationFee = attendeeDto.registrationFee;
  }
}
