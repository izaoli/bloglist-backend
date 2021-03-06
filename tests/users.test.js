const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})
    const userObjects = helper.initialUsers
        .map(user => new User(user))
    const promiseArray = userObjects.map(user => user.save())
    await Promise.all(promiseArray)
})

describe('endpoint get /', () => {
    test('users are returned as json', async () => {
        await api.get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('the amount of users is correct', async () => {
        const response = await api.get('/api/users')
        expect(response.body.length).toEqual(helper.initialUsers.length)
    })

    test('a specific user is within the returned users', async () => {
        const response = await api.get('/api/users')
        const all = response.body.map(r => r.username)
        expect(all).toContain(helper.initialUsers[1].username)
    })

    test('contains unique id', async () => {
        const response = await api.get(`/api/users`)
        response.body.map(user => expect(user.id).toBeDefined())
    })

    test('contains blogs', async () => {
        const response = await api.get(`/api/users`)
        response.body.map(user => expect(user.blogs).toBeDefined())
    })
})

describe('endpoint post /', () => {
    test('a new user can be added', async () => {
        const user = {
            name: "Raimunda Liz Ferreira",
            username: "raimundalizferreira@unipsicotaubate.com.br",
            password: "eT8wToPPpy"
        }

        const response = await api.post('/api/users')
            .send(user)
        console.log(response.body)
        expect(response.body.username).toEqual(user.username)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            name: 'Superuser',
            username: usersAtStart[0].username,
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if password too short', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            name: 'myuser',
            username: 'example@email.com',
            password: 'oi',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('password too short')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    // test('blog without title is not added', async () => {
    //     const blog = {
    //         author: 'George Orwell',
    //         url: 'https://www.google.com/'
    //     }

    //     await api
    //         .post('/api/blogs')
    //         .send(blog)
    //         .expect(400)

    //     const blogsAtEnd = await helper.blogsInDb()
    //     expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    // })

    // test('blog without url is not added', async () => {
    //     const blog = {
    //         title: '1984',
    //         author: 'George Orwell'
    //     }

    //     await api
    //         .post('/api/blogs')
    //         .send(blog)
    //         .expect(400)

    //     const blogsAtEnd = await helper.blogsInDb()
    //     expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    // })

    // test('a blog without the likes parameter defaults to zero likes', async () => {
    //     const blog = {
    //         title: "IT",
    //         author: "Stephen King",
    //         url: "https://fullstackopen.com/"
    //     }

    //     const response = await api
    //         .post('/api/blogs')
    //         .send(blog)
    //         .expect(200)
    //     expect(response.body.likes).toEqual(0)
    // })
})

// describe('endpoint delete /:id', () => {
//     test('a blog can be deleted', async () => {
//         const blogsAtStart = await helper.blogsInDb()
//         const blogToDelete = blogsAtStart[0]

//         await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)
//         const blogsAtEnd = await helper.blogsInDb()

//         expect(blogsAtEnd).toHaveLength(
//             helper.initialBlogs.length - 1
//         )

//         const titles = blogsAtEnd.map(r => r.title)
//         expect(titles).not.toContain(blogToDelete.title)
//     })
// })

// describe('endpoint put /:id', () => {
//     test('increase likes by 1', async () => {
//         const blogsAtStart = await helper.blogsInDb()
//         const blog = blogsAtStart[0]
//         blog.likes = blog.likes + 1

//         const response = await api
//             .put(`/api/blogs/${blog.id}`)
//             .send(blog)
//         const blogsAtEnd = await helper.blogsInDb()

//         expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

//         const blogChanged = response.body
//         expect(blogChanged.likes).toEqual(blog.likes)
//     })
// })

afterAll(async () => {
    await mongoose.connection.close()
})
