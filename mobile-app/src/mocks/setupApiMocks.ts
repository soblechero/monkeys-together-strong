import MockAdapter from 'axios-mock-adapter';
import {apiClient} from '@/services/api';
import {errors, users as usersData, genres, games as gamesData} from '@/mocks';
import {ApiError, AuthResponse, User, GenresList, GamesList} from '@/types';
import {convertGamesList} from "@/utils";

const users: User[] = usersData as User[];
const games: GamesList = convertGamesList(gamesData);

const setupApiMocks = () => {
    const mock = new MockAdapter(apiClient, {delayResponse: 500});

    console.log('Mock API setup initialized');

    mock.onPost('/login').reply(config => {
        const {email, password}: User = JSON.parse(config.data);
        const user = users.find(user => user.email === email && user.password === password);
        if (user) {
            return [200, {access_token: user.access_token} as AuthResponse];
        } else {
            return [401, {message: errors.invalid_credentials} as ApiError];
        }
    });

    mock.onPost('/signup').reply(config => {
        const {email, username, password}: User = JSON.parse(config.data);
        const userExists = users.find(user => user.email === email);
        if (userExists) {
            return [400, {message: errors.user_already_exists} as ApiError];
        } else {
            const newUser: User = {
                username,
                email,
                password,
                access_token: `new_token_for_${email}`
            };
            users.push(newUser);
            return [201, {access_token: newUser.access_token} as AuthResponse];
        }
    });

    mock.onGet('/protected').reply(config => {
        const authHeader = config.headers?.Authorization || null;
        const token = authHeader ? authHeader.split(' ')[1] : null;
        const user = users.find(user => user.access_token === token);
        if (user) {
            return [200, {logged_in_as: user.email}];
        } else {
            return [401, {message: errors.invalid_token} as ApiError];
        }
    });

    mock.onGet('/genres').reply(200, {genres: genres} as GenresList);

    mock.onGet('/user/genres').reply((config) => {
        const token = config.headers?.Authorization;
        console.log('User token for get /user/genres:', token);

        const userGenres: GenresList = {genres: ['Adventure', 'Shooter']};
        return [200, userGenres];
    });

    mock.onPost('/user/genres').reply((config) => {
        const token = config.headers?.Authorization;
        console.log('User token for post /user/genres:', token);

        const {genres}: GenresList = JSON.parse(config.data);
        console.log(`Updated user genres for token ${token}:`, genres);
        return [200, {message: 'Genres updated successfully'}];
    });

    mock.onGet('/games').reply(200, games as GamesList);

    mock.onGet('/games/search').reply(config => {
        const params = config.params;
        let filteredGames = games;
        if (params.genre) {
            filteredGames = filteredGames.filter(game => game.genres.includes(params.genre));
        }
        if (params.name) {
            filteredGames = filteredGames.filter(game => game.name.toLowerCase().includes(params.name.toLowerCase()));
        }
        if (params.releaseDate) {
            const releaseDate = new Date(params.releaseDate);
            filteredGames = filteredGames.filter(game => game.releaseDate.getTime() === releaseDate.getTime());
        }
        if (params.platform) {
            filteredGames = filteredGames.filter(game => game.platforms.includes(params.platform));
        }
        return [200, filteredGames];
    });

    mock.onGet('/user/games').reply(async config => {
        const token = config.headers?.Authorization;
        console.log('User token for get /user/games:', token);

        // const {value} = await getAuthToken();
        // if (token !== `Bearer ${value}`) {
        //     return [401, {message: 'Invalid token'}];
        // }

        const userGames: GamesList = games.slice(0, 5); // Mocking with first 5 games as an example
        return [200, userGames];
    });

    mock.onPost('/user/games').reply(async config => {
        const token = config.headers?.Authorization;
        console.log('User token for post /user/games:', token);

        // const {value} = await getAuthToken();
        // if (token !== `Bearer ${value}`) {
        //     return [401, {message: 'Invalid token'}];
        // }

        const {games} = JSON.parse(config.data);
        console.log('Updated user games:', games);
        return [200];
    });

    return mock;
};


export default setupApiMocks;
