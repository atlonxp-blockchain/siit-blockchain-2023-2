import React, { useState } from 'react';
import './componentStyle.css';


const Poster = ({account,contract}) => {
  const [inputValue, setInputValue] = useState('');
  const [imageLinkInput, setImageLinkInput] = useState(null);

  // const [imageValue, setImageValue] = useState('');
  // const [posterAccount] = useState(account);

  async function handleSubmit() {
    // Implement your logic here
    try {
      if (!account) {
        console.error('You have to login first');
        return;
      }
      const timestamp = Math.floor(new Date().getTime() / 1000);
      await contract.createPost(inputValue, imageLinkInput,timestamp, { gasLimit: 2100000 });

      console.log('Post submitted successfully');
    } catch (error) {
      console.error('Error submitting post:', error);
    }
    // console.log('Submitted value:', inputValue,'. By Account: ',account);
    // // You can call your contract function or perform other actions
    // const post = await contract.createPost(inputValue,{gasLimit:150000});
    // console.log("Check post :", post);
  };
  // async function createPostWithImage(imageHash) {
  //   // Call your contract function to create a post with the image
  //   const post = await contract.createPost(inputValue, imageHash, { gasLimit: 150000 });
  //   console.log('Post created:', post);
  // }
  return (
    <div className="posterContainer">
    <label className= 'label' >
      Post your Advertisement : 
    </label>
      <textarea
        className='input'
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        rows={4}
        cols={50}/>
        <label className= 'label' >
      Images to upload URL : 
    </label>
      <input
        className="input"
        type="text"
        value={imageLinkInput}
        onChange={(e) => setImageLinkInput(e.target.value)}
        placeholder="Enter image link (URL)"
      />
      {account ?
      (
      <button className='button' onClick={handleSubmit}> Post </button> 
      ):
      ( 
      <div className="errText"> You have to login first  </div>
      )}
    </div>
  );
};

export default Poster;