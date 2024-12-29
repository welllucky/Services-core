import { IResponseFormat } from "@/typing";
import { getUserByToken } from "@/utils";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { SearchRepository } from "./search.repository";

@Injectable()
class SearchServices {
  constructor(private readonly repository: SearchRepository) {}

  async searchTickets(
    token: string,
    searchTerm: string,
  ): Promise<IResponseFormat<unknown>> {
    const { userData } = await getUserByToken(token);
    const userId = userData?.register;

    if (!userId) {
      throw new HttpException(
        {
          title: "User provided is not valid",
          message:
            "User not found or not exists, please check the credentials.",
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const tickets = await this.repository.searchTickets(userId, searchTerm);

    if (!tickets) {
      throw new HttpException(
        {
          title: "Tickets not found",
          message: "No tickets found with the provided search term.",
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      data: tickets,
      message: `${tickets.length} tickets found with the search term.`,
    };
  }
}

export { SearchServices };
