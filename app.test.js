process.env.NODE_ENV = "test";


const request = require("supertest");
const app = require("./app");
const db = require("./db");

let testBook;


beforeEach(async function(){
    let testBookQuery = await db.query(`
    INSERT INTO books (isbn, amazon_url, author, language, pages, publisher, title, year)
VALUES ('0691161519', 'http://a.co/eobPtX3', 'Matthew Chanway', 'french', 50, 'sprott shaw',
'best book ever', 1990)`)  
    testBook = testBookQuery.rows[0];
})

afterEach(async function(){
    await db.query("DELETE FROM books");   
})

afterAll(async function(){
    await db.end();
})


describe("get /books", () => {
    test("get all books", async () => {

        let res = await request(app).get("/books");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({"books":[{"isbn": "0691161519", "amazon_url": "http://a.co/eobPtX3", "author": "Matthew Chanway",
        "language": "french", "pages": 50, "publisher": "sprott shaw", "title": "best book ever", "year": 1990}]});
       
    })
})


describe("get /books/isbn", () => {
    test("get book by isbn", async () => {

        let res = await request(app).get("/books/0691161519");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({"book":{"isbn": "0691161519", "amazon_url": "http://a.co/eobPtX3", "author": "Matthew Chanway",
        "language": "french", "pages": 50, "publisher": "sprott shaw", "title": "best book ever", "year": 1990}});
       
    })

    test("invalid isbn returns error", async () => {
        let res = await request(app).get("/books/069116151");
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({"error":{"message":"There is no book with an isbn '069116151","status":404},"message":"There is no book with an isbn '069116151"})

    })
})

describe("post /books/", () => {
    test("create new book by isbn", async () => {

        let res = await request(app).post("/books").send({"isbn": "0691161518", "amazon_url": "http://a.co/eobPtX2", "author": "Matthew Peter",
        "language": "english", "pages": 55, "publisher": "kwantlen", "title": "worst book ever", "year": 1990});
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({"book":{"isbn": "0691161518", "amazon_url": "http://a.co/eobPtX2", "author": "Matthew Peter",
        "language": "english", "pages": 55, "publisher": "kwantlen", "title": "worst book ever", "year": 1990}});
       
    })

    test("missing new book data returns error", async () => {

        let res = await request(app).post("/books").send({"isbn": "0691161518", "amazon_url": "http://a.co/eobPtX2", "author": "Matthew Peter",
        "language": "english", "pages": 55, "publisher": "kwantlen", "title": "worst book ever"});
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({"error":{"message":["instance requires property \"year\""],"status":400},"message":["instance requires property \"year\""]});
       
    })


})

describe("put /books/", () => {
    test("update book by isbn", async () => {

        let res = await request(app).put("/books/0691161519").send({"amazon_url": "http://a.co/eobPtX3", "author": "Matthew Chanway",
        "language": "french", "pages": 50, "publisher": "sprott shaw", "title": "new title", "year": 1990});
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({"book":{"isbn": "0691161519","amazon_url": "http://a.co/eobPtX3", "author": "Matthew Chanway",
        "language": "french", "pages": 50, "publisher": "sprott shaw", "title": "new title", "year": 1990}});
       
    })

    test("update book by isbn fails with missing data", async () => {

        let res = await request(app).put("/books/0691161519").send({"amazon_url": "http://a.co/eobPtX3", "author": "Matthew Chanway",
        "language": "french", "pages": 50, "publisher": "sprott shaw", "title": "new title"});
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({"error":{"message":["instance requires property \"year\""],"status":400},"message":["instance requires property \"year\""]});
       
    })

})

describe("delete /books/", () => {
    test("delete book by isbn", async () => {

        let res = await request(app).delete("/books/0691161519");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: "Book deleted" });
       
    })

})


        


       