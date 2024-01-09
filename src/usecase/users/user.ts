/* eslint-disable prettier/prettier */
import type { Prisma } from "@prisma/client";

import { prismaClient } from "@/lib/config/db.config";
import type { STATUS } from "@/lib/types";
import type { AttendeInterface } from "@/models";
import { Attendee } from "@/models";

export class UserUsecase {
  async findById(id: string) {
    const user = await prismaClient.user.findFirst({ where: { id } });
    return user;
  }

  async findByEmail(email: string) {
    const user = await prismaClient.user.findFirst({
      where: {
        email,
      },
    });
    return user;
  }

  async updateUser(
    id: string,
    updateUserDto: Partial<Prisma.UserUpdateInput>,
    email?: string,
  ) {
    const user = await prismaClient.user.update({
      where: {
        id,
        email,
      },
      data: updateUserDto,
    });
    return user;
  }

  async deleteUser(id: string) {
    const user = await prismaClient.user.delete({ where: { id } });
    return user;
  }

  async attendEvent(data: AttendeInterface) {
    const attendData = new Attendee(data);
    const event = await prismaClient.event.findFirst({
      where: { id: data.eventId },
    });
    if (event) {
      const attendee = await prismaClient.attendee.create({
        data: attendData,
      });
      return attendee;
    }
    return {
      status: null,
    };
  }

  async updateParticipation(id: string, userId: string, status: STATUS) {
    const updateAttendens = await prismaClient.attendee.update({
      where: {
        id,
        userId,
      },
      data: {
        AvailableForEvent: status,
      },
    });
    return updateAttendens;
  }

  async getAllAttendens(userId: string) {
    const attendenes = await prismaClient.attendee.findMany({
      where: { userId },
    });
    return attendenes;
  }
}
