import React from 'react';


// ThoughtList component will receive two props: a title and the thoughts array.
// We destructure the argument data to avoid using props.title and props.thoughts
// throughout the JSX code.
const ThoughtList = ({ thoughts, title }) => {
   if (!thoughts.length) {
      return <h3>No Thoughts Yet</h3>;
   };

   return (
      <div>
         <h3>{title}</h3>

            {/* key helps React to internally track which data needs to be
                re-rendered if something changes. */}
            {thoughts && thoughts.map(thought => (
            <div key={thought._id} className="card mb-3">
               <p className="card-header">
                  {thought.username} thought on {thought.createdAt}
               </p>

               <div className="card-body">
                  <p>{thought.thoughtText}</p>

                  <p className="mb-0">
                     {/* We're conditionally displaying a message to contextualize
                     what the call to action should be. If there are no reactions,
                     the user will start the discussion by adding the first reaction.
                     If there are reactions, the user will view or add their own
                     reaction to an existing list. 
                     */}
                     Reactions: {thought.reactionCount} || Click to{' '}
                     {thought.reactionCount ? 'see' : 'start'} the discussion!
                  </p>
               </div>
            </div>
         ))}
      </div>
   );
};

export default ThoughtList;