import { Body, Controller, Get, Param, Post, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { BookDto } from './dtos/book.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/seed')
  seed() {
    return this.appService.seed();
  }

  @Get("/api/books")
  getBooks(){
    return this.appService.getBooks();
  }

  @Post("/api/books")
  createBook(@Body() book: BookDto){
    return this.appService.addBook(book);
  }

  @Post("/api/books/:id/rent")
  rent(@Param("id") id: number){
    return this.appService.rent(+id);
  }
}
