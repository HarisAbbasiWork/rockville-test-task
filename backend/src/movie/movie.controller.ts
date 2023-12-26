import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res } from '@nestjs/common';
import { CreateStudentDto } from 'src/dto/create-student.dto';
import { MovieService } from 'src/movie/movie.service';

@Controller('movie')
export class MovieController {
    constructor(private readonly movieService: MovieService,) { }
    @Get('/categories')
    async getCategories(@Res() response) {
        try {
            const categories = await this.movieService.getCategories();
            if (!categories || categories.length == 0) {
                return response.status(HttpStatus.OK).json({
                    message: 'No categories found.',
                    categories,
                });
            } else {
                return response.status(HttpStatus.OK).json({
                    message: 'All categories data found successfully',
                    categories,
                });
            }

        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @Get('/')
    async getMoviesWithCategories(@Res() response) {
        try {
            const movies = await this.movieService.getMovies()
            if (!movies || movies.length == 0) {
                return response.status(HttpStatus.OK).json({
                    message: 'No movies found.',
                    movies,
                });
            } else {
                return response.status(HttpStatus.OK).json({
                    message: 'All movies data found successfully',
                    movies,
                });
            }
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }
    @Post('/rate/:movieId')
    async giveRatingToMovie(@Param('movieId') movieId: string, @Body('rating') rating: number, @Req() req: any, @Res() response) {
        try {
            const userId = req.user;
            const success = await this.movieService.giveRatingToMovie(userId, movieId, rating);
            if (success) {
                return response.status(HttpStatus.OK).json({
                    success: true,
                    message: 'Rating has been successfully added',
                });
            } else {
                return response.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: 'Rating could not be added',
                });
            }
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

}
