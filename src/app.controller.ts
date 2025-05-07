import { Controller, Get, Res, VERSION_NEUTRAL } from "@nestjs/common";
import { Response } from "express";
import { join } from "path";

@Controller({
    version: VERSION_NEUTRAL,
})
export class AppController {
    @Get()
    getHtml(@Res() res: Response) {
        return res.sendFile(join(__dirname, "..", "public", "index.html"));
    }
}
