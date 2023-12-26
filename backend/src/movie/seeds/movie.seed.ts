import { Command, Positional } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { Model } from "mongoose";
import { IMovie } from 'src/interface/movie.interface';
import { ICategory } from 'src/interface/category.interface';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MovieSeed {
    constructor(
        @InjectModel('Movie') private readonly movieModel: Model<IMovie>,
        @InjectModel('Category') private readonly categoryModel: Model<ICategory>,
    ) { }

    @Command({ command: 'create:category-movie', describe: 'create categories and movies' })
    async create() {
        const categoriesCount = await this.categoryModel.countDocuments({})
        if (categoriesCount == 0) {
            let categories = [{
                name: "Action"
            }, {
                name: "Horror"
            }, {
                name: "Drama"
            }, {
                name: "Comedy"
            }]
            for (let i = 0; i < categories.length; i++) {
                const category = await this.categoryModel.create({
                    name: categories[i].name,
                });
                console.log("category ", category)
            }
        }
        const moviesCount = await this.movieModel.countDocuments({})
        if (moviesCount == 0) {
            const dramaCategory = await this.categoryModel.findOne({ name: "Drama" })
            let movies = [{
                name: "About Time"
            }, {
                name: "Intersteller"
            }]
            for (let i = 0; i < movies.length; i++) {
                const movie = await this.movieModel.create({
                    name: movies[i].name,
                    category: dramaCategory._id
                });
                console.log(movie);
            }
        }


    }
}