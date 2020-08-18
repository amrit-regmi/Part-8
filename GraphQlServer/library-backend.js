const { ApolloServer, gql, UserInputError ,AuthenticationError } = require('apollo-server')
const { v1: uuid } = require('uuid')
const mongoose = require('mongoose')
const Book = require('./models/Book')
const Author = require('./models/Author')
const User = require('./models/User')
const config = require('./config')
const jwt = require('jsonwebtoken')

const mongoUrl = config.MONGODB_URI
const JWT_SECRET = "sekret"

mongoose.set('useFindAndModify', false)
mongoose.connect( mongoUrl, { useNewUrlParser: true,useUnifiedTopology: true , useCreateIndex:true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })
 
const typeDefs = gql`
  type Book {
    title : String!
    published: Int!
    author : Author!
    id: ID!
    genres: [String!]!
  }

  type Author {
    name: String!
    born: Int
    id: ID!
    bookCount : Int!
  }

  type User {
    username: String!
    favouriteGenre: String!
    id: ID!
  }
  
  type LoggedInUser {
    token: String!
    username: String!
    favouriteGenre: String!
  }


  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks  ( author: String , genre: String ) : [ Book! ]!
    allAuthors: [Author!]!
    me: User

  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ) : Book

    addBorn(
      name:String!
      setBornTo: Int!
    ): Author

    createUser(
      username: String!
      favouriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): LoggedInUser
  }
`
const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root,args) => {
       
     /* let bookFiltered
      bookFiltered = args.author? books.filter(book => book.author === args.author) : books
      bookFiltered = args.genre? bookFiltered.filter(book => book.genres.includes(args.genre)) : bookFiltered
      return bookFiltered*/
      let condition = {}

      if(args.genre){
        condition.genres = {$in: [args.genre]}
      }

      books = await Book.find(condition)
      return books
    },
    
    allAuthors: () => Author.find({}),

    me :(root,args,context) =>{
      return context.currentUser
    }
    
  },

  Author:{
    bookCount: async (root)=>{
      const booksByAuthor = await Book.find({'author':root.id})
      return booksByAuthor.length
    }
  },

  Book:{
    author: async(root) => {
      const author = await Author.findById(root.author)
      
      return {
        name: author.name,
        id:author.id,
        born: author.born 
      }
    }
    
  },

  Mutation: {
    addBook: async (root,args,context) => {
      /*if(Book.find(book => book.title === args.title && book.author === args.author && book.published === args.published)){
        throw new UserInputError(`${args.title} - ${args.published} by ${args.author} already exists on database`)
      }
      const book = {...args, id: uuid()}
      books = books.concat(book)

     if (!(authors.some(author => author.name === args.name))) {
      author= {name:args.author, id: uuid()}
      authors= authors.concat(author)
     } 
     return book*/

    const currentUser = context.currentUser

    if (!currentUser) {
      throw new AuthenticationError("Invalid authentication")
    }

     try {

      let author = await Author.findOne({name:args.author})
      if (!author){
        author = new Author({name:args.author})
        await author.save()
      }
      console.log(author.id)
      const book = new Book({...args, author: author.id})
      await book.save()
      return book
     }
     
     catch (error) {
      throw new UserInputError(error.message, {
        invalidArgs: args,
      })

     }
     
    },

    addBorn: async (root,args,context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError("Invalid authentication")
      }
  
      const author = await Author.findOneAndUpdate({name:args.name},{born: args.setBornTo},{new:true})
      return author
    },

    createUser : async(root,args) => {
      const user = new User (args)
      try { 
        const savedUser = await user.save()
        return savedUser
      }catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
       
       }
       
    },

    login: async(root,args) => {
      const user = await User.findOne({username:args.username})
    

      if(!user || args.password !=='secret'){
        throw new UserInputError('Wrong credentials')
      }

      return {token: jwt.sign({username: user.username, id:user.id},JWT_SECRET),username:user.username,favouriteGenre:user.favouriteGenre  }

    }
  }
} 

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async({req}) => {
    
    const auth = req? req.headers.authorization : null
    if (auth && auth.toLocaleLowerCase().startsWith('bearer')){
      const token = jwt.verify(auth.substring(7), JWT_SECRET)
      const currentUser = await User.findById(token.id)
      return {currentUser}
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})