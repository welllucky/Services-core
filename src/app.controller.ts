import { Controller, Get, Res, VERSION_NEUTRAL } from "@nestjs/common";
import { Response } from "express";
import { join } from "path";
import { IsPublic } from "./utils";

@Controller({
    version: VERSION_NEUTRAL,
})
export class AppController {
    @Get()
    @IsPublic()
    getHtml(@Res() res: Response) {
        return res.sendFile(join(__dirname, "..", "public", "index.html"));
    }
}
