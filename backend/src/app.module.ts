// app.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserSchema } from './schema/user.schema';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { ConfigModule } from '@nestjs/config';
import { PostSchema } from './schema/post.schema';
import { MovieSchema } from './schema/movie.schema';
import { CategorySchema } from './schema/category.schema';
import { JwtMiddleware } from './jwt.middleware';
import { MovieController } from './movie/movie.controller';
import { MovieService } from './movie/movie.service';
import { RatingSchema } from './schema/rating.schema';
import { MovieSeedModule } from './movie/seeds/movie.seed.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL,
      { dbName: 'rockvilletest' }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema },{ name: 'Movie', schema: MovieSchema },{ name: 'Category', schema: CategorySchema },,{ name: 'Rating', schema: RatingSchema }]),
    MovieSeedModule
  ], 
  controllers: [AppController,UserController, MovieController],
  providers: [AppService,UserService, MovieService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude(
        'user/login',
        'user/signup',
      )
      .forRoutes(UserController,MovieController)
  }
}