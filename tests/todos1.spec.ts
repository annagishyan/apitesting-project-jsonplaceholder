import { test, expect, request } from '@playwright/test';

const BASE_URL = 'https://jsonplaceholder.typicode.com';
const todoId = 1;
//HOMEWORK
// GET	/todos
// GET	/todos/1
// POST	/todos
// PUT	/todos/1
// PATCH	/todos/1
// DELETE	/todos/1


test.describe('TODOS API Testing', () => {


    test('GET /todos', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/todos`);

        expect(response.ok()).toBe(true);
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
            //TODO   1. completed-ը չեմ ստուգի կամ ->   1. chem stugi, konkret chi

        }

    });


    test(`GET  /todos/${todoId}`, async ({ request }) => {
        const response = await request.get(`${BASE_URL}/todos/${todoId}`);

        expect(response.ok()).toBe(true);
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
        expect([true, false]).toContain(data.completed);


    });

    test('POST /todos', async ({ request }) => {

        const new_todo = {
            userId: todoId,
            title: `New Todo ${todoId}`,
            completed: Math.random() < 0.5
        }

        //  Math.random():  վերադարձնում է random թիվ 0-ից մինչև 1։ 
        //     random-ը ընկավ 0–0.5 → true
        // random-ը ընկավ 0.5–1 → false

        // Այսինքն՝ մոտավորապես 50% true / 50% false։
        //TODO 2. ո՞նց ա հարմար թեստինգի ժամանակ ստատիկ true կամ false ուղարկել թե ռանդով ձևով ստանալ boolean type ունեցող data-ի արժեքը
        // mecmasamb false shat depqerum

        const response = await request.post(`${BASE_URL}/todos`, {
            data: new_todo

        });

        expect(response.ok()).toBeTruthy();
        expect(response.status).toBe(201);

        const data = await response.json();
        expect(data.id).toBeDefined();
        expect(data.userId).toBe(new_todo.userId);
        expect(data.title).toBe(new_todo.title);
        expect(data.completed).toBe(new_todo.completed);
        // expect(data.completed).toContain([true, false]);
        //tvyal depqum vat e,


    });


    test(`PUT /todos/${todoId}`, async ({ request }) => {

        const updated_todo = {
            userId: todoId,
            title: 'Update Todo Title',
            completed: true
        }

        const response = await request.post(`${BASE_URL}/todos/${todoId}`, {
            data: updated_todo

        });

        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data.id).toBe(todoId);
        expect(data.userId).toBe(updated_todo.userId);
        expect(data.title).toBe(updated_todo.title);
        expect(data.completed).toBe(updated_todo.completed);

    });

    test(`PATCH  /todos/${todoId}`, async ({ request }) => {

        const partial_update = {
            title: 'Partial update title of Todo'
        };

        const response = await request.patch(`${BASE_URL}/todos/${todoId}`, {
            data: partial_update
        });

        expect(response.ok()).toBeTruthy();
        expect(response.status).toBe(200);

        const data = await response.json();
        expect(data.id).toBe(todoId);
        expect(data.userId).toBeDefined();
        expect(data.title).toBe(partial_update.title);
        expect(data.completed).toBeDefined();

    });

    test(`DELETE  /todos/{todoId}`, async ({ request }) => {
        const response = await request.delete(`${BASE_URL}/todos/${todoId}`);

        expect(response.ok()).toBeTruthy();
        expect(response.ok()).toBe(200);

        const data = await response.json();
        //TODO 4.   Laravel-um proyektnerum kan Resource classner en sarqum` nersum grum te vor depqum
        //hatkapes inch patasxan petqa veradarna amen harcumic heto, orinak
        //delete-i depqum text el ein veradarcnum` post/todo has been deleted successfully
        //test anox-y petqa proyekti et faylerin el canotana che? hakarak depqum urish patasxan expect kani

        expect(typeof data).toBe('object');
        expect(data.id).not.toBeDefined();
        expect(data.userId).not.toBeDefined();
        expect(data.title).not.toBeDefined();
        expect(data.completed).not.toBeDefined();
    });




    test(`PUT 2  /todos/${todoId}`, async ({ request }) => {

        const getResponse = await request.get(`${BASE_URL}/todos/${todoId}`);
        const currentTodo = await getResponse.json();

        const updated_todo = {
            userId: currentTodo.userId,
            title: 'Update Todo Title',
            completed: !currentTodo.completed
        };

        const response = await request.put(`${BASE_URL}/todos/${todoId}`, {
            data: updated_todo
        });

        expect(response.status()).toBe(200);

        const data = await response.json();

        expect(data.completed).toBe(!currentTodo.completed);
    });


});

