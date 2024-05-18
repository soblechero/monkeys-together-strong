import MockAdapter from 'axios-mock-adapter';
import {apiClient} from '@/services/api';
import {errors, users as usersData, genres} from '@/mocks';
import {ApiError, AuthResponse, User, GenresList} from '@/types';

const users: User[] = usersData as User[];

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

    mock.onGet('/genres').reply(200, genres as GenresList);

    mock.onGet('/user/genres').reply((config) => {
        const token = config.headers?.Authorization;
        console.log('Received token for get user genres:', token);

        const userGenres: GenresList = {genres: ['Adventure', 'Shooter']};
        return [200, userGenres];
    });

    mock.onPost('/user/genres').reply((config) => {
        const token = config.headers?.Authorization;
        console.log('Received token for update user genres:', token);

        const {genres}: GenresList = JSON.parse(config.data);
        console.log(`User genres for token ${token}:`, genres);
        return [200, {message: 'Genres updated successfully'}];
    });

    return mock;
};

export default setupApiMocks;
