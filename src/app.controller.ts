import { Controller, Get, Res, VERSION_NEUTRAL } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { join } from "path";
import { IsPublic } from "@/utils/decorators";
import { Throttle } from "@nestjs/throttler";

@ApiTags('Application')
@Controller({
    version: VERSION_NEUTRAL,
})
export class AppController {
    @ApiOperation({ summary: 'Serve application homepage' })
    @ApiResponse({
        status: 200,
        description: 'HTML homepage file',
        content: {
            'text/html': {
                schema: {
                    type: 'string',
                    example: '<!DOCTYPE html>...'
                }
            }
        }
    })
    @Throttle({ default: { limit: 20, ttl: 60000 } })
    @Get()
    @IsPublic()
    getHtml(@Res() res: Response) {
        return res.sendFile(join(__dirname, "..", "public", "index.html"));
    }
}
