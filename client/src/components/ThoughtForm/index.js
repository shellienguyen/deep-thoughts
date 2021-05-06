import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { ADD_THOUGHT } from '../../utils/mutations';
import { QUERY_THOUGHTS, QUERY_ME } from '../../utils/queries';


const ThoughtForm = () => {
   const [thoughtText, setText] = useState('');
   const [characterCount, setCharacterCount] = useState(0);

   /*
   The addThought() function will run the actual mutation. The error variable
   will initially be undefined but can change depending on if the mutation failed.
   */
   const [addThought, { error }] = useMutation(ADD_THOUGHT, {
      /*
      In the update() function, addThought represents the new thought that was
      just created. Using the cache object, read what's currently saved in the
      QUERY_THOUGHTS cache and then update it with writeQuery() to include the
      new thought object.
      */
      update(cache, { data: { addThought } }) {
         try {
            // Could potentially not exist yet, so wrap in a try...catch
            // The Home page relies on QUERY_THOUGHTS
            const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });
            cache.writeQuery({
               query: QUERY_THOUGHTS,
               data: { thoughts: [addThought, ...thoughts] }
            });
         } catch (e) {
            console.error(e);
         }

         // Update me object's cache, appending new thought to the end of the array
         // The Profile page relies on QUERY_ME
         const { me } = cache.readQuery({ query: QUERY_ME });
         cache.writeQuery({
            query: QUERY_ME,
            data: { me: { ...me, thoughts: [...me.thoughts, addThought] } }
         });
      }
   });

   const handleChange = event => {
      if (event.target.value.length <= 280) {
         setText(event.target.value);
         setCharacterCount(event.target.value.length);
      };
   };

   const handleFormSubmit = async event => {
      event.preventDefault();

      try {
         // add thought to database
         await addThought({
            variables: { thoughtText }
         });

         // clear form value
         setText('');
         setCharacterCount(0);
      }
      catch (e) {
         console.error(e);
      };
   };

   return (
      <div>
         <p className={`m-0 ${characterCount === 280 || error ? 'text-error' : ''}`}>
            Character Count: {characterCount}/280
            {error && <span className="ml-2">Something went wrong...</span>}
         </p>

         <form className="flex-row justify-center justify-space-between-md align-stretch">
            <textarea
               placeholder="Here's a new thought..."
               value={thoughtText}
               className="form-input col-12 col-md-9"
               onChange={handleChange}>
            </textarea>

            <button className="btn col-12 col-md-3" type="submit" onClick={handleFormSubmit}>Submit</button>
         </form>
      </div>
   );
};

export default ThoughtForm;