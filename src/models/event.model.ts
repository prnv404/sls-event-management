export interface EventInterface {
  eventId: string;
  name: string;
  description: string;
  date: string;
  location: string;
  maxAttendes: number;
}

export class Event {
  eventId: string;
  name: string;
  description: string;
  date: string;
  location: string;
  maxAttendes: number;

  constructor(eventDto: EventInterface) {
    this.eventId = eventDto.eventId;
    this.name = eventDto.name;
    this.date = eventDto.date;
    this.description = eventDto.description;
    this.location = eventDto.location;
    this.maxAttendes = eventDto.maxAttendes;
  }
}
