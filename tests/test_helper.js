const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }
]

const nonExistingId = async () => {
    const blog = new Blog({
        title: 'willremovethissoon',
        author: 'placeholder',
        url: 'https://fullstackopen.com/'
    })
    await blog.save()
    await blog.remove()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await blogsWithoutJSON()
    return blogs.map(blog => blog.toJSON())
}

const blogsWithoutJSON = async () => await Blog.find({})

const initialUsers = [
    {
        name: "Diego Fernando Daniel da Luz",
        username: "diegofernandodanieldaluz@structureesquadrias.com.br",
        password: "gte6ED6g9M"
    },
    {
        name: "Jessica Julia Sophia Oliveira",
        username: "jessicajuliasophiaoliveira-90@inpa.gov.br",
        password: "xUF37k8h6M"
    },
    {
        name: "Rosangela Daiane Jennifer da Conceicao",
        username: "rosangeladaianejenniferdaconceicao_@mucoucah.com.br",
        password: "r1NOj5TBeu"
    },
]

const usersInDb = async () => {
    const users = await usersWithoutJSON()
    return users.map(user => user.toJSON())
}

const usersWithoutJSON = async () => await User.find({})

module.exports = {
    initialBlogs, nonExistingId, blogsInDb, blogsWithoutJSON,
    initialUsers, usersInDb, usersWithoutJSON
}