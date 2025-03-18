import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { faker } from '@faker-js/faker';
import { BookDto } from './dtos/book.dto';

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  async seed() {
    const rentals = []
    for (let i = 0; i < 15; i++) {
      rentals.push(
        await this.prisma.rentals.create({
          data: {
            book_id: faker.number.int({ min: 1, max: 50 }),
            start_date: faker.date.anytime(),
            end_date: faker.date.anytime()
          }
        })
      )
    }
    return rentals
  }

  async getBooks() {
    return {
      data: await this.prisma.books.findMany({
        select: {
          id: true,
          title: true,
          author: true,
          publish_year: true,
          page_count: true
        }
      })
    }
  }

  async addBook(newBook: BookDto) {
    return await this.prisma.books.create({
      data: {
        title: newBook.title,
        author: newBook.author,
        publish_year: newBook.publish_year,
        page_count: newBook.page_count,
        created_at: new Date(),
        updated_at: new Date()
      }
    })
  }

  async rent(id: number) {
    try {
      if(!(await this.checkBook(id))){
        throw new HttpException('There is no book with this id', HttpStatus.NOT_FOUND)
      }
      const lastRent = await this.getLastRendByBookId(id)

      const now = new Date()

      if(lastRent && now < lastRent?.end_date){
        throw new HttpException("This book is already rented", HttpStatus.CONFLICT)
      }

      return await this.prisma.rentals.create({
        data: {
          book_id: id,
          start_date: now,
          end_date: new Date(now.setDate(now.getDate() + 7))
        },
      })
    } catch (e) {
      throw e
    }
  }

  private async getLastRendByBookId(id: number) {
    const rents = await this.prisma.rentals.findMany({
      where: {
        book_id: id,
      },
      select: {
        end_date: true
      },
      orderBy: [
        {
          end_date: 'asc'
        }
      ]
    })
    return rents[rents.length-1]
  }

  private async checkBook(id: number){
    return await this.prisma.books.findUnique({
      where: {
        id: id
      }
    })
  }
}
