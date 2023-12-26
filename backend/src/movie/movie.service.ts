import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { IMovie } from 'src/interface/movie.interface';
import { ICategory } from 'src/interface/category.interface';
import { IRating } from 'src/interface/rating.interface';
@Injectable()
export class MovieService {
    constructor(
        @InjectModel('Movie') private movieModel: Model<IMovie>,
        @InjectModel('Category') private categoryModel: Model<ICategory>,
        @InjectModel('Rating') private ratingModel: Model<IRating>,
    ) { }
    async getCategories(): Promise<ICategory[]> {
        const categories = await this.categoryModel.find({})
        if (!categories) {
            return null
        }
        return categories;
    }
    async getMovies(): Promise<IMovie[]> {
        const movies = await this.movieModel.find({}).populate('category')
        if (!movies || movies.length == 0) {
            return null
        }
        return movies;
    }
    async giveRatingToMovie(userId: string, movieId: string, rating: number): Promise<boolean> {
        const movie = await this.movieModel.findById(movieId).exec();
    
        if (!movie) {
            return false;
        }
    
        const newRating = await new this.ratingModel({ user:userId, movie, rating }).save();
    
        // Update the ratings array in Movie documents
        movie.ratings.push(newRating._id);
    
        await movie.save();
        return true;
    }    
}
