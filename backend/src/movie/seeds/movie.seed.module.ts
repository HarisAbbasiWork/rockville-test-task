// movie.seed.module.ts
import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieSeed } from './movie.seed';
import { MovieSchema } from '../../schema/movie.schema';
import { CategorySchema } from '../../schema/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Movie', schema: MovieSchema },
      { name: 'Category', schema: CategorySchema },
    ]),
  ],
  providers: [MovieSeed],
})
export class MovieSeedModule implements OnModuleInit {
  constructor(private readonly movieSeed: MovieSeed) {}

  async onModuleInit() {
    await this.movieSeed.create();
  }
}
