import MockAdapter from 'axios-mock-adapter';
import apiClient from '@/services/api/apiClient';
import {errors, users as usersData, genres as genresData, games as gamesData} from '@/mocks';
import {Message, Token, User, GamesList, GameSearchCriteria, OAuth2RequestForm} from '@/types';
import {convertGamesList} from "@/utils";

const users: User[] = usersData as User[];
const games: GamesList = convertGamesList(gamesData);
const genres: string[] = genresData as string[];

const setupApiMocks = () => {
    const mock = new MockAdapter(apiClient, {delayResponse: 300});

    console.log('Mock API setup initialized');

    mock.onPost('/login').reply(config => {
        const {username, password}: OAuth2RequestForm = JSON.parse(config.data);
        const user = users.find(user => user.email === username && user.password === password);
        if (user) {
            return [200, {access_token: user.access_token} as Token];
        } else {
            return [401, {message: errors.invalid_credentials} as Message];
        }
    });

    mock.onPost('/signup').reply(config => {
        const {name, email, password}: User = JSON.parse(config.data);
        const userExists = users.find(user => user.email === email);
        if (userExists) {
            return [400, {message: errors.user_already_exists} as Message];
        } else {
            const newUser: User = {
                name,
                email,
                password,
                access_token: `new_token_for_${email}`
            };
            users.push(newUser);
            return [201, {access_token: newUser.access_token} as Token];
        }
    });

    mock.onGet('/protected').reply(config => {
        const authHeader = config.headers?.Authorization || null;
        const token = authHeader ? authHeader.split(' ')[1] : null;
        const user = users.find(user => user.access_token === token);
        if (user) {
            return [200, {logged_in_as: user.email}];
        } else {
            return [401, {message: errors.invalid_token} as Message];
        }
    });

    mock.onGet('/genres').reply(200, genres);

    mock.onGet('/user/genres').reply((config) => {
        const token = config.headers?.Authorization;
        console.log('User token for get /user/genres:', token);

        const userGenres = ['Adventure', 'Shooter'];
        return [200, userGenres];
    });

    mock.onPut('/user/genres').reply(async config => {
        const token = config.headers?.Authorization;
        console.log('User token for put /user/genres:', token);

        try {
            const data = JSON.parse(config.data);

            if (data.genres) {
                console.log('Creating or updating user genres:', data.genres);
                return [200, {message: 'Genres created/updated successfully'}];
            } else {
                return [400, {message: 'Invalid request body'}];
            }
        } catch (error) {
            return [400, {message: 'Invalid JSON'}];
        }
    });

    mock.onPost('/user/genres').reply(async config => {
        const token = config.headers?.Authorization;
        console.log('User token for post /user/genres:', token);

        try {
            const data = JSON.parse(config.data);

            if (data.genre) {
                console.log('Adding genre:', data.genre);
                return [200, {message: 'Genre added to favorites'}];
            } else {
                return [400, {message: 'Invalid request body'}];
            }
        } catch (error) {
            console.error('Error parsing request data:', error);
            return [400, {message: 'Invalid JSON'}];
        }
    });

    mock.onDelete(/\/user\/genres\/.*/).reply(config => {
        const token = config.headers?.Authorization;
        console.log(`User token for delete /user/genre/$name:`, token);

        const genreName = config.url!.split('/').pop();
        console.log('Removing genre:', genreName);
        return [200, {message: 'Game removed from favorites'}];
    });

    //mock.onGet('/games').reply<GamesList>(200, games as GamesList);

    mock.onGet('/games').reply<GamesList>(config => {
        const params: GameSearchCriteria = config.params;
        let filteredGames: GamesList = games;
        if (params.genres && params.genres.length > 0) {
            filteredGames = filteredGames.filter(game =>
                params.genres?.some(genre => game.genres.map(g => g.toLowerCase()).includes(genre.toLowerCase()))
            );
        }
        if (params.names && params.names.length > 0) {
            filteredGames = filteredGames.filter(game =>
                params.names?.some(name => game.name.toLowerCase().includes(name.toLowerCase()))
            );
        }
        if (params.releaseYears && params.releaseYears.length > 0) {
            filteredGames = filteredGames.filter(game =>
                params.releaseYears?.some(year => new Date(game.releaseDate).getFullYear() === year)
            );
        }
        if (params.platforms && params.platforms.length > 0) {
            filteredGames = filteredGames.filter(game =>
                params.platforms?.some(platform => game.platforms.map(p => p.toLowerCase()).includes(platform.toLowerCase()))
            );
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

    mock.onPut('/user/games').reply(async config => {
        const token = config.headers?.Authorization;
        console.log('User token for put /user/games:', token);

        // const {value} = await getAuthToken();
        // if (token !== `Bearer ${value}`) {
        //     return [401, {message: 'Invalid token'}];
        // }

        try {
            const data = JSON.parse(config.data);

            if (data.games) {
                console.log('Creating or updating user games:', data.games);
                return [200, {message: 'Games created/updated successfully'}];
            } else {
                return [400, {message: 'Invalid request body'}];
            }
        } catch (error) {
            return [400, {message: 'Invalid JSON'}];
        }
    });

    mock.onPost('/user/games').reply(async config => {
        const token = config.headers?.Authorization;
        console.log('User token for post /user/games:', token);

        // const {value} = await getAuthToken();
        // if (token !== `Bearer ${value}`) {
        //     return [401, {message: 'Invalid token'}];
        // }

        try {
            const data = JSON.parse(config.data);

            if (data.game) {
                console.log('Adding game:', data.game);
                return [200, {message: 'Game added to favorites'}];
            } else {
                return [400, {message: 'Invalid request body'}];
            }
        } catch (error) {
            console.error('Error parsing request data:', error);
            return [400, {message: 'Invalid JSON'}];
        }
    });

    mock.onDelete(/\/user\/games\/.*/).reply(config => {
        const token = config.headers?.Authorization;
        console.log(`User token for delete /user/games/$name:`, token);

        const gameName = config.url!.split('/').pop();
        console.log('Removing game:', gameName);
        return [200, {message: 'Game removed from favorites'}];
    });


    return mock;
};


export default setupApiMocks;
