import { Controller, Get, Res, VERSION_NEUTRAL } from "@nestjs/common";
import { Response } from "express";
import { join } from "path";
import { IsPublic } from "./utils/decorators/IsPublic.decorator";
import { Throttle } from "@nestjs/throttler";

@Controller({
    version: VERSION_NEUTRAL,
})
export class AppController {
    @Throttle({ default: { limit: 20, ttl: 60000 } })
    @Get()
    @IsPublic()
    getHtml(@Res() res: Response) {
        return res.sendFile(join(__dirname, "..", "public", "index.html"));
    }
}
