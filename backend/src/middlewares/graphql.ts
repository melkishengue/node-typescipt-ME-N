import Server from '../server/server';
import IMiddleware from './middleware.interface';
import graphqlHttp from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import { movieService } from '../services/movieService';
import { reviewService } from '../services/reviewService';
import { join } from 'path';
import { readFileSync } from 'fs';
import { IMovie } from '../models/movie';
import { IReview } from '../models/review';

export default class GraphqlMiddleware implements IMiddleware {
    private _baseUrl = '/graphql';
    private _schema: GraphQLSchema;

    constructor () {
        const typeDefs = readFileSync(join(__dirname, '../graphql/schema.graphql'), 'utf8');
        this._schema = makeExecutableSchema({ typeDefs });
    }

    init(server: Server): void {
        server.middleware(this._baseUrl, graphqlHttp({
            schema: this._schema,
            rootValue: {
                movies: () => {
                    return movieService.findAllMovies()
                },
                reviews: () => { 
                    return reviewService.findAll()
                },
                createMovie: async (args: any) => {
                    const { year, title, imdb, type } = args;

                    let movie: IMovie = {
                        year,
                        title,
                        imdb,
                        type
                    };

                    return await movieService.create(movie);
                },
                createReview: async (args: any) => {
                    const { rating, date, reviewer, text } = args;

                    let review: IReview = {
                        rating,
                        date,
                        reviewer,
                        text
                    };

                    return await reviewService.create(review);
                }
            },
            graphiql: true
        }), false, 'graphql');
    }
}