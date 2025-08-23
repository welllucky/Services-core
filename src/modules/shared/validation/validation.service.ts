import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { PositionRepository } from "@/repositories/position.repository";
import { SectorRepository } from "@/repositories/sector.repository";

@Injectable()
export class ValidationService {
    constructor(
        private readonly positionRepository: PositionRepository,
        private readonly sectorRepository: SectorRepository,
    ) {}

    async validatePositionAndSector(positionName: string, sectorName: string) {
        const [position, sector] = await Promise.all([
            this.positionRepository.findByName(positionName),
            this.sectorRepository.findByName(sectorName),
        ]);

        if (!sector || !position) {
            throw new HttpException(
                {
                    title: "Sector or position not found",
                    message:
                        "Sector or position not found, please check the sector and position.",
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        const sectorWithPositions = await this.sectorRepository.findWithPositions(sector.id);
        const existPositionInSector = sectorWithPositions?.positions?.find(
            (r) => r.id === position.id,
        );

        if (!existPositionInSector) {
            throw new HttpException(
                {
                    title: "Position not found in sector",
                    message:
                        "Position not found in sector, please check the position and sector.",
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        return { position, sector };
    }

    async validatePosition(positionName: string) {
        const position = await this.positionRepository.findByName(positionName);
        
        if (!position) {
            throw new HttpException(
                {
                    title: "Position not found",
                    message: "Position not found, please check the position name.",
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        return position;
    }

    async validateSector(sectorName: string) {
        const sector = await this.sectorRepository.findByName(sectorName);
        
        if (!sector) {
            throw new HttpException(
                {
                    title: "Sector not found",
                    message: "Sector not found, please check the sector name.",
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        return sector;
    }

    async getPositionsBySector(sectorName: string) {
        const sector = await this.validateSector(sectorName);
        const sectorWithPositions = await this.sectorRepository.findWithPositions(sector.id);
        
        return sectorWithPositions?.positions || [];
    }
}