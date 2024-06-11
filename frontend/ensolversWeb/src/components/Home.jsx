/* eslint-disable no-unused-vars */
import React from 'react';
import NoteList from './NoteList';

const Home = () => {
  return (
    <div>
      <h1>Notes, left click for edit them</h1>
      {/*renderize component NoteList*/}
      <NoteList />
    </div>
  );
};

export default Home;
