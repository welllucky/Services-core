import { Ticket } from "@/entities";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";

@Injectable()
class SearchRepository {
  constructor(
    @InjectRepository(Ticket) private readonly repository: Repository<Ticket>,
  ) {}

  searchTickets(
    userId: string,
    searchTerm: string,
    pagination?: { page?: number; index?: number },
  ) {
    const pageIndex =
      !pagination?.index || pagination?.index === 1 ? 0 : pagination?.index;
    const page = pagination?.page || 10;

    return this.repository.find({
      where: [
        {
          description: Like(`%${searchTerm}%`),
          createdBy: { register: userId },
        },
        {
          resume: Like(`%${searchTerm}%`),
          createdBy: { register: userId },
        },
        {
          id: Like(`%${searchTerm}%`),
          createdBy: { register: userId },
        },
        {
          description: Like(`%${searchTerm}%`),
          resolver: { register: userId },
        },
        {
          resume: Like(`%${searchTerm}%`),
          resolver: { register: userId },
        },
        {
          id: Like(`%${searchTerm}%`),
          resolver: { register: userId },
        },
      ],
      order: {
        createdAt: "DESC",
      },
      take: page,
      skip: pageIndex * page,
    });
  }
}

export { SearchRepository };
