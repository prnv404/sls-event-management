import { prismaClient } from '@/lib/config/db.config';
import type { EventInterface } from '@/models';
import { Event } from '@/models';

export class EventUseCase {
  async create(userId: string, createDto: EventInterface) {
    const eventData = new Event(createDto);
    const event = await prismaClient.event.create({
      data: {
        userId,
        ...eventData,
      },
    });
    return event;
  }

  async findById(id: string) {
    const event = await prismaClient.event.findFirst({
      where: { id },
      include: {
        User: true,
      },
    });
    return event;
  }

  async findBdyUserId(userId: string) {
    const events = await prismaClient.event.findMany({
      where: {
        userId,
      },
    });
    return events;
  }

  async update(id: string, updateDto: Partial<EventInterface>) {
    const updateEvent = await prismaClient.event.update({
      where: { id },
      data: { ...updateDto },
    });
    return updateEvent;
  }

  async delete(id: string) {
    const deletedEvent = await prismaClient.event.delete({
      where: { id },
    });
    return deletedEvent;
  }
}
