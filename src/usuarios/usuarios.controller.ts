import { Body, Controller, HttpStatus, Param, Patch, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosDto } from './usuarios.dto';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly service: UsuariosService) {}

    @Post()
    async register(@Body() usuario: UsuariosDto, @Res() response: Response) {
        const result = await this.service.register(usuario);
        response
            .status(HttpStatus.CREATED)
            .json({ ok: true, result, msg: 'creado' });
    }

    @Patch(':id')
    @UseInterceptors(FilesInterceptor('files'))
    async updateUser(
        @Param('id') id: number,
        @Body() user: Partial<UsuariosDto>,
        @UploadedFiles() files: Express.Multer.File[],
        @Res() res: Response,
    ) {
        const result = await this.service.updateUser(id, user, files);
        res.status(HttpStatus.OK).json({ ok: true, result, msg: 'approved' });
    }
}
