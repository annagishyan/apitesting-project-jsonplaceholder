import { test, expect} from '@playwright/test';

test.describe.serial('API restful-booker.', () => {

  let token: string;
  let bookingId: number;

  test('Auth - CreateToken', async ({ request }) => {

    const response = await request.post(`https://restful-booker.herokuapp.com/auth`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        username: "admin",
        password: "password123"
      }
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(typeof data).toBe('object');

    expect(data.token).toBeDefined();

    token = data.token;

  });


  test('Booking - CreateBooking', async ({ request }) => {

    const new_book = {
      firstname: "Jim",
      lastname: "Brown",
      totalprice: 111,
      depositpaid: true,
      bookingdates: {
        checkin: "2018-01-01",
        checkout: "2019-01-01"
      },
      additionalneeds: "Breakfast"

    };

    const response = await request.post('https://restful-booker.herokuapp.com/booking', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: new_book

    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();

    expect(typeof data).toBe('object');

    expect(data.bookingid).toBeDefined();
    expect(data.booking).toBeDefined();

    const booking = data.booking;

    expect(booking.firstname).toBeDefined();
    expect(booking.lastname).toBeDefined();
    expect(booking.totalprice).toBeDefined();
    expect(booking.depositpaid).toBeDefined();
    expect(booking.bookingdates).toBeDefined();
    expect(booking.bookingdates.checkin).toBeDefined();
    expect(booking.bookingdates.checkout).toBeDefined();
    // expect(booking.additionalneeds).toBeDefined();

    expect(typeof booking.firstname).toBe('string');
    expect(typeof booking.lastname).toBe('string');
    expect(typeof booking.totalprice).toBe('number');
    expect(typeof booking.depositpaid).toBe('boolean');
    expect(typeof booking.bookingdates).toBe('object');
    expect(typeof booking.bookingdates.checkin).toBe('string');
    expect(typeof booking.bookingdates.checkout).toBe('string');
    // expect(typeof booking.additionalneeds).toBe('string');



    expect(booking.firstname).toBe(new_book.firstname);
    expect(booking.lastname).toBe(new_book.lastname);
    expect(booking.totalprice).toBe(new_book.totalprice);
    expect(booking.depositpaid).toBe(new_book.depositpaid);
    expect(booking.bookingdates.checkin).toBe(new_book.bookingdates.checkin);
    expect(booking.bookingdates.checkout).toBe(new_book.bookingdates.checkout);
    // expect(booking.additionalneeds).toBe(new_book.additionalneeds);


    bookingId = data.bookingid;

  });


  test('Booking - GetBookingIds', async ({ request }) => {

    const response = await request.get(`https://restful-booker.herokuapp.com/booking`);
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();

    for (let elem of data) {
      expect(elem.bookingid).toBeDefined();
      expect(typeof elem.bookingid).toBe('number');
    }

  });


  test('Booking - GetBookingIds Filter by name', async ({ request }) => {

    const firstname = "sally";
    const lastname = "brown";


    const response = await request.get(`https://restful-booker.herokuapp.com/booking?firstname=${firstname}&lastname=${lastname}`);
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();

    for (let elem of data) {
      expect(elem.bookingid).toBeDefined();
      expect(typeof elem.bookingid).toBe('number');
    }

  });


  test('Booking - GetBookingIds Filter by checkin and checkout', async ({ request }) => {


    const response = await request.get(`https://restful-booker.herokuapp.com/booking?checkin=2014-03-13&checkout=2014-05-21`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();

    for (let elem of data) {
      expect(elem.bookingid).toBeDefined();
      expect(typeof elem.bookingid).toBe('number');

    }

  });


  test('Booking - GetBooking', async ({ request }) => {
    bookingId = 1;//1 եմ վերագրում, քանի որ թեստն առանձին աշխատեցնելուց նոր ստեղծված bookingId չեմ ունենա, իսկ additionalneeds-ն էլ քոմենթ չեմ անի

    const response = await request.get(`https://restful-booker.herokuapp.com/booking/${bookingId}`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(typeof data).toBe('object');

    expect(data.firstname).toBeDefined();
    expect(data.lastname).toBeDefined();
    expect(data.totalprice).toBeDefined();
    expect(data.depositpaid).toBeDefined();
    expect(data.bookingdates).toBeDefined();
    expect(data.bookingdates.checkin).toBeDefined();
    expect(data.bookingdates.checkout).toBeDefined();
    // expect(data.additionalneeds).toBeDefined();

    expect(typeof data.firstname).toBe('string');
    expect(typeof data.lastname).toBe('string');
    expect(typeof data.totalprice).toBe('number');
    expect(typeof data.depositpaid).toBe('boolean');
    expect(typeof data.bookingdates).toBe('object');
    expect(typeof data.bookingdates.checkin).toBe('string');
    expect(typeof data.bookingdates.checkout).toBe('string');
    // expect(typeof data.additionalneeds).toBe('string');

  });


  test('Booking - UpdateBooking', async ({ request }) => {
    bookingId = 1; //1 եմ վերագրում, քանի որ թեստն առանձին աշխատեցնելուց նոր ստեղծված bookingId չեմ ունենա, իսկ additionalneeds-ն էլ ստիպված քոմենթ չեմ անի

    const updated_data = {
      firstname: "James",
      lastname: "Brown",
      totalprice: 111,
      depositpaid: true,
      bookingdates: {
        checkin: "2018-01-01",
        checkout: "2019-01-01"
      },
      additionalneeds: "Breakfast"

    };

    const response = await request.put(`https://restful-booker.herokuapp.com/booking/${bookingId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `token=${token}`

      },
      data: updated_data

    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();

    expect(data.firstname).toBeDefined();
    expect(data.lastname).toBeDefined();
    expect(data.totalprice).toBeDefined();
    expect(data.depositpaid).toBeDefined();
    expect(data.bookingdates).toBeDefined();
    expect(data.bookingdates.checkin).toBeDefined();
    expect(data.bookingdates.checkout).toBeDefined();
    // expect(data.additionalneeds).toBeDefined());

    expect(typeof data.firstname).toBe('string');
    expect(typeof data.lastname).toBe('string');
    expect(typeof data.totalprice).toBe('number');
    expect(typeof data.depositpaid).toBe('boolean');
    expect(typeof data.bookingdates).toBe('object');
    expect(typeof data.bookingdates.checkin).toBe('string');
    expect(typeof data.bookingdates.checkout).toBe('string');
    // expect(typeof data.additionalneeds).toBe('string');

    expect(data.firstname).toBe(updated_data.firstname);
    expect(data.lastname).toBe(updated_data.lastname);
    expect(data.totalprice).toBe(updated_data.totalprice);
    expect(data.depositpaid).toBe(updated_data.depositpaid);
    expect(data.bookingdates.checkin).toBe(updated_data.bookingdates.checkin);
    expect(data.bookingdates.checkout).toBe(updated_data.bookingdates.checkout);
    // expect(data.additionalneeds).toBe(updated_data.additionalneeds);

  });


  test('Booking - PartialUpdateBooking', async ({ request }) => {
    bookingId = 1; //1 եմ վերագրում, քանի որ թեստն առանձին աշխատեցնելուց նոր ստեղծված bookingId չեմ ունենա, 

    const partial_updated_book = {
      firstname: "James",
      lastname: "Brown"
    };

    const response = await request.patch(`https://restful-booker.herokuapp.com/booking/${bookingId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `token=${token}`
      },
      data: partial_updated_book

    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();

    expect(typeof data).toBe('object');

    expect(data.firstname).toBeDefined();
    expect(data.lastname).toBeDefined();
    expect(data.totalprice).toBeDefined();
    expect(data.depositpaid).toBeDefined();
    expect(data.bookingdates).toBeDefined();
    expect(data.bookingdates.checkin).toBeDefined();
    expect(data.bookingdates.checkout).toBeDefined();
    // expect(data.additionalneeds).toBeDefined();

    expect(typeof data.firstname).toBe('string');
    expect(typeof data.lastname).toBe('string');
    expect(typeof data.totalprice).toBe('number');
    expect(typeof data.depositpaid).toBe('boolean');
    expect(typeof data.bookingdates).toBe('object');
    expect(typeof data.bookingdates.checkin).toBe('string');
    expect(typeof data.bookingdates.checkout).toBe('string');
    // expect(typeof data.additionalneeds).toBe('string');

    expect(data.firstname).toBe(partial_updated_book.firstname);
    expect(data.lastname).toBe(partial_updated_book.lastname);

  });


  test('Booking - DeleteBooking', async ({ request }) => {

    bookingId = 1;

    const response = await request.delete(`https://restful-booker.herokuapp.com/booking/${bookingId}`, {
      headers: {
        'Cookie': `token=${token}`
      },

    });

    expect(response.status()).toBe(201);

    const data = await response.text();

    expect(data).toBe('Created');

    const getResponse = await request.get(`https://restful-booker.herokuapp.com/booking/${bookingId}`);

    expect(getResponse.status()).toBe(404);

  });


});


