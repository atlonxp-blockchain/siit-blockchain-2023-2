import React,{useState,useEffect, useCallback} from 'react';
import './componentStyle.css';
import PostCard from './PostCard.js';

const PostDisplayer = ({contract}) => {
    // const [inputValue, setInputValue] = useState('');
    // console.log('Submitted value:', inputValue,'. By Account: ',account);
    // You can call your contract function or perform other actions
      const [postList, setPostList] = useState([]);
      const [showpost, setShowpost] = useState(false);

      const refreshPost = useCallback(async () => {
        try {
          if (contract) {
            const posts = await contract.getAllPost();
            if (posts.length > 0) {

              setShowpost(true);
              
              setPostList(posts);
              console.log('Posts:', posts);
            } else {
              setShowpost(false);
              console.log('No Posts Yet');
            }
          } else {
            console.error('No Contract Yet');
          }
        } catch (error) {
          console.error('Error refreshing posts:', error);
        }
      }, [contract]);

    useEffect(()=>{
      refreshPost();
    },[contract,refreshPost]);

  return (
    <div className="PostDisplayerContainer">
      <button className='button' onClick={refreshPost}> 
        refresh 
      </button>
      {showpost===true? (
        postList.map((post)=>(
        <PostCard post={post} contract={contract}></PostCard>))
        )
      :(
        <label className= 'label'>
          No post here
        </label>
        )}
      
    </div>
  );
};

export default PostDisplayer;