const { User, Thought } = require( '../models' );
const { AuthenticationError } = require( 'apollo-server-express' );
const { signToken } = require( '../utils/auth' );


const resolvers = {
   Query: {
      me: async (parent, args, context) => {
         if (context.user) {
           const userData = await User.findOne({ _id: context.user._id })
             .select('-__v -password')
             .populate('thoughts')
             .populate('friends');
       
           return userData;
         };
       
         throw new AuthenticationError('Not logged in');
      },
      users: async () => { 
         return User.find()
           .select('-__v -password')
           .populate('thoughts')
           .populate('friends');
      },
      user: async (parent, { username }) => {
         return User.findOne({ username })
           .select('-__v -password')
           .populate('friends')
           .populate('thoughts');
      },
      thoughts: async ( parent, { username }) => {
         const params = username ? { username } : {};
         return Thought.find( params ).sort({ createdAt: -1 });
      },
      thought: async ( parent, { _id }) => {
         return Thought.findOne({ _id });
      }
   },
   /*
   Upon successful operation, a token is generated.  After receiving this token,
   the client can continue to send it with any other requests. The back end will
   then decode the token and know exactly who was making the request, because all
   of the user's information is saved on the token itself.
   */
   Mutation: {
      addUser: async ( parent, args) => {
         const user = await User.create( args );
         const token = signToken( user );
       
         return { token, user };
      },
      login: async (parent, { email, password }) => {
         const user = await User.findOne({ email });
       
         if ( !user ) {
           throw new AuthenticationError( 'Incorrect credentials' );
         }
       
         const correctPw = await user.isCorrectPassword( password );
       
         if ( !correctPw ) {
           throw new AuthenticationError( 'Incorrect credentials' );
         }
       
         const token = signToken( user );
         return { token, user };
      },
      addThought: async (parent, args, context) => {
         if (context.user) {
            const thought = await Thought.create({ ...args, username: context.user.username });
       
            await User.findByIdAndUpdate(
               { _id: context.user._id },
               { $push: { thoughts: thought._id } },
               { new: true }
            );
       
            return thought;
         }
       
         throw new AuthenticationError('You need to be logged in!');
      },
      addReaction: async (parent, { thoughtId, reactionBody }, context) => {
         if (context.user) {
            // Reactions are stored as arrays on the Thought model, hence the Mongo
            // $push operator. Since an existing thought is being updated, the client
            // will need to provide the corresponding thoughtId
            const updatedThought = await Thought.findOneAndUpdate(
               { _id: thoughtId },
               { $push: { reactions: { reactionBody, username: context.user.username } } },
               { new: true, runValidators: true }
            );
       
            return updatedThought;
         };
       
         throw new AuthenticationError('You need to be logged in!');
      },
      /*
      This mutation will look for an incoming friendId and add that to the current
      user's friends array. A user can't be friends with the same person twice,
      though, hence why we're using the $addToSet operator instead of $push to prevent
      duplicate entries.
      */
      addFriend: async (parent, { friendId }, context) => {
         if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
               { _id: context.user._id },
               { $addToSet: { friends: friendId } },
               { new: true }
            ).populate('friends');
       
            return updatedUser;
         }
       
         throw new AuthenticationError('You need to be logged in!');
      }
   }
};
 

module.exports = resolvers;