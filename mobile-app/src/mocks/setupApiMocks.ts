import { apiClient } from '@/services/api';
import MockAdapter from 'axios-mock-adapter';
import {users as usersData, errors } from '@/mocks';
import { User } from '@/types';

const users: User[] = usersData as User[];

const setupApiMocks = () => {
    const mock = new MockAdapter(apiClient, { delayResponse: 500 });

    console.log('Mock API setup initialized');

    mock.onPost('/login').reply(config => {
        const { email, password } = JSON.parse(config.data);
        const user = users.find(user => user.email === email && user.password === password);
        if (user) {
            return [200, { access_token: user.access_token }];
        } else {
            return [401, { message: errors.invalid_credentials }];
        }
    });

    mock.onPost('/signup').reply(config => {
        const { email, username, password } = JSON.parse(config.data);
        const userExists = users.find(user => user.email === email);
        if (userExists) {
            return [400, { message: errors.user_already_exists }];
        } else {
            const newUser: User = {
                username,
                email,
                password,
                access_token: `new_token_for_${email}`
            };
            users.push(newUser);
            return [201, { access_token: newUser.access_token }];
        }
    });

    mock.onGet('/protected').reply(config => {
        const authHeader = config.headers?.Authorization || null;
        const token = authHeader ? authHeader.split(' ')[1] : null;
        const user = users.find(user => user.access_token === token);
        if (user) {
            return [200, { logged_in_as: user.email }];
        } else {
            return [401, { message: errors.invalid_token }];
        }
    });

    return mock;
};

export default setupApiMocks;
