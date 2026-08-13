import { test, expect } from '@playwright/test';
const todoId = 1;


const BASE_URL = 'https://jsonplaceholder.typicode.com/'

test.describe('TODOS API TESTING', () => {

    test('Get /todos', async ({ request }) => {

        const response = await request.get(`${BASE_URL}/todos`);

        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);


        const data = await response.json();

        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBe(200);

        for (let obj of data) {
            expect(obj.userId).toBeDefined();
            expect(obj.id).toBeDefined();
            expect(obj.title).toBeDefined();
            expect(obj.completed).toBeDefined();


            expect(typeof obj.userId).toBe('number');
            expect(typeof obj.id).toBe('number');
            expect(typeof obj.title).toBe('string');
            expect(typeof obj.completed).toBe('boolean');

            expect(obj.userId).toBeGreaterThan(0);
            expect(obj.id).toBeGreaterThan(0);
            expect(obj.title.length).toBeGreaterThan(0);


            // obj.id
            let count = 0;
            for (let obj2 of data) {
                if (obj.id == obj2.id) {
                    count++;
                }
            }
            expect(count, `Count Must be 1, but now ${obj.id} = ${count}`).toBe(1);

        }


    });

    test(`Get /todos/${todoId}`, async ({ request }) => {

        const response = await request.get(`${BASE_URL}/todos/${todoId}`);

        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);

        const data = await response.json();

        expect(typeof data).toBe('object');

        expect(data.userId).toBeDefined();
        expect(data.id).toBeDefined();
        expect(data.title).toBeDefined();
        expect(data.completed).toBeDefined();


        expect(typeof data.userId).toBe('number');
        expect(typeof data.id).toBe('number');
        expect(typeof data.title).toBe('string');
        expect(typeof data.completed).toBe('boolean');


        expect(data.id).toBe(todoId);
        expect(data.userId).toBeGreaterThan(0);
        expect(data.title.length).toBeGreaterThan(0);
    });

    test('POST	/todos', async ({ request }) => {

        let userId: number;

        await test.step('GET userId from users list', async () => {
            const response_users = await request.get('https://jsonplaceholder.typicode.com/users');
            expect(response_users.ok()).toBeTruthy();
            expect(response_users.status()).toBe(200);
            const data_users = await response_users.json();
            expect(Array.isArray(data_users)).toBeTruthy();
            expect(data_users.length).toBeGreaterThan(0);
            userId = data_users[0].id;
        });


        await test.step('Create New Todo', async () => {

            const new_todos = {
                userId: userId,
                title: "New todos 1",
                completed: false
            }

            const response = await request.post(`${BASE_URL}/todos`, {
                data: new_todos
            })

            expect(response.ok()).toBeTruthy();
            expect(response.status()).toBe(201);

            const data = await response.json();

            expect(data.id).toBeDefined();
            expect(data.userId).toBe(new_todos.userId);
            expect(data.title).toBe(new_todos.title);
            expect(data.completed).toBe(new_todos.completed);
        });

    })

    test(`PUT	/todos/${todoId}`, async ({ request }) => {


        // HOMEWORK

        let userId: number;

        await test.step('GET userId from users list', async () => {
            const response_users = await request.get('https://jsonplaceholder.typicode.com/users');
            expect(response_users.ok()).toBeTruthy();
            expect(response_users.status()).toBe(200);

            const data_users = await response_users.json();
            expect(Array.isArray(data_users)).toBeTruthy();
            expect(data_users.length).toBeGreaterThan(0);
            userId = data_users[0].id;

        });

        await test.step(`Update ${todoId} Todo`, async () => {

            const update_todos = {
                userId: userId,
                title: `Update TODO ${todoId}`,
                completed: false
            }

            const response = await request.post(`${BASE_URL}/todos`, {
                data: update_todos
            })

            expect(response.ok()).toBeTruthy();
            expect(response.status()).toBe(201);

            const data = await response.json();

            expect(data.id).toBeDefined();
            expect(data.userId).toBe(update_todos.userId);
            expect(data.title).toBe(update_todos.title);
            expect(data.completed).toBe(update_todos.completed);
        });
    });



    test(`PATCH	/todos/${todoId}`, async ({ request }) => {

        const partial_update_todo = {
            title: 'Partial update title'
        };


        const response = await request.patch(`${BASE_URL}/todos/${todoId}`, {
            data: partial_update_todo
        })

        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data.id).toBe(todoId);
        expect(data.title).toBe(partial_update_todo.title);
        expect(data.userId).toBeDefined();
        expect(data.completed).toBeDefined();

    })

    test(`DELETE	/todos/${todoId}`, async ({ request }) => {

        const response = await request.delete(`${BASE_URL}/todos/${todoId}`)

        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(typeof data).toBe('object');
        expect(data.id).not.toBeDefined();
        expect(data.userId).not.toBeDefined();
        expect(data.title).not.toBeDefined();
        expect(data.completed).not.toBeDefined();
    })

});