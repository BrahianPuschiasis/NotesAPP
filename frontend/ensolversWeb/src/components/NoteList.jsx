/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import '../styles/NoteList.css';
import NoteService from '../services/NoteService';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const NoteList = ({ onDeleteNote }) => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [archiveModalIsOpen, setArchiveModalIsOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [editedDescription, setEditedDescription] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [newNoteDescription, setNewNoteDescription] = useState('');

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');


  const fetchCategories = async () => {
    try {
      const data = await NoteService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchNotes = async () => {
    try {
      const data = await NoteService.getAllNotes();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const openCategoryModal = (noteId) => {
    setSelectedNote(noteId);
    setModalIsOpen(true);
    setSelectedCategories(notes.find((note) => note.id === noteId).categories.map((category) => category.id));
  };

  const handleCategorySelection = (categoryId) => {
    const isSelected = selectedCategories.includes(categoryId);
    if (isSelected) {
      setSelectedCategories((prev) => prev.filter((id) => id !== categoryId));
    } else {
      setSelectedCategories((prev) => [...prev, categoryId]);
    }
  };

  const confirmSaveCategories = async () => {
  try {
    const selectedNoteObject = notes.find((note) => note.id === selectedNote);

    if (!selectedNoteObject) {
      console.error('Selected note not found');
      return;
    }

    const noteCategories = selectedNoteObject.categories.map((category) => category.id);

    //save  categories for add
    const categoriesToAdd = selectedCategories.filter((categoryId) => !noteCategories.includes(categoryId));

    //save categories for delete
    const categoriesToRemove = noteCategories.filter((categoryId) => !selectedCategories.includes(categoryId));



   //delete categories
    await NoteService.deleteCategoriesFromNote(selectedNote, categoriesToRemove);

  //add categories
    await NoteService.addCategoriesToNote(selectedNote, categoriesToAdd);

    setModalIsOpen(false);
    setSelectedNote(null);
    setSelectedCategories([]);
    fetchNotes();
  } catch (error) {
    console.error('Error adding categories to note:', error);
  }
};



  const confirmArchive = async () => {
    try {
      await NoteService.archiveNote(selectedNote);
      setArchiveModalIsOpen(false);
      setSelectedNote(null);
      fetchNotes();
    } catch (error) {
      console.error('Error archiving note:', error);
    }
  };

  const handleDeleteNote = (noteId) => {
    setSelectedNote(noteId);
    setDeleteModalIsOpen(true); 
  };
  
  const confirmDelete = async () => {
    try {
      await NoteService.deleteNote(selectedNote);
      setDeleteModalIsOpen(false);
      setSelectedNote(null);
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleEditNote = (noteId) => {
    const noteToEdit = notes.find((note) => note.id === noteId);
    setEditingNote(noteId);
    setEditedDescription(noteToEdit.description);
  };


  const confirmAddCategory = async () => {
    try {
      await NoteService.createCategory({ name: newCategoryName });
      setAddingCategory(false);
      setNewCategoryName('');
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };
  


  const confirmEdit = async () => {
    try {
      const response = await NoteService.updateNote({
        id: editingNote,
        description: editedDescription,
        archived: notes.find((note) => note.id === editingNote).archived,
      });

      if (response.success) {
        setEditingNote(null);
        setEditedDescription('');
        fetchNotes();
      } else {
        console.error('Error updating note. Unexpected response:', response);
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleArchiveNote = (noteId) => {
    setSelectedNote(noteId);
    setArchiveModalIsOpen(true);
  };

  const confirmAddNote = async () => {
    try {
      await NoteService.addNote({
        description: newNoteDescription,
        archived: false,
      });

      setAddingNote(false);
      setNewNoteDescription('');
      fetchNotes();
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setArchiveModalIsOpen(false);
    setSelectedNote(null);
    setEditingNote(null);
    setEditedDescription('');
    setAddingNote(false);
    setNewNoteDescription('');
    setSelectedCategories([]);
  };

  const toggleShowArchived = () => {
    setShowArchived((prevShowArchived) => !prevShowArchived);
  };

  const filteredNotes = showArchived === null ? notes : notes.filter((note) => note.archived === showArchived);

  const filteredNotesByCategory = selectedCategory
    ? filteredNotes.filter((note) =>
        note.categories.some((category) => category.name === selectedCategory)
      )
    : filteredNotes;

  return (
    <div className="note-container">
      <div className="filter-buttons">
        <button onClick={() => setShowArchived(true)}>Show Archived</button>
        <button onClick={() => setShowArchived(false)}>Show Actives</button>
        <button onClick={() => setShowArchived(null)}>Show All</button>
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <button onClick={() => setAddingNote(true)}>Add Note</button>
        <button onClick={() => setAddingCategory(true)}>Add Category</button>

      </div>


   
      <div className="notes-container">
  {filteredNotesByCategory.map((note) => (
    <div className={`note ${editingNote === note.id ? 'expanded-textarea' : ''}`} key={note.id}>
      <button className="delete-button" onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}>
        &#x2715;
      </button>
      <button className="archive-button" onClick={(e) => { e.stopPropagation(); handleArchiveNote(note.id); }}>
        <span className="star">{note.archived ? <span>&#9733;</span> : <span>&#9734;</span>}</span>
      </button>
      {editingNote === note.id ? (
        <div className={`edit-form ${editingNote === note.id ? 'expanded-textarea' : ''}`}>
          <textarea
            className={`edit-textarea ${editingNote === note.id ? 'expanded-textarea' : ''}`}
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
          />
          <div className="edit-buttons">
            <button onClick={confirmEdit}>Save</button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <p onClick={() => handleEditNote(note.id)}>{note.description}</p>
          <div className="category-buttons">
            {note.categories.map((category, index) => (
              <button key={category.id} className="category-button">
                {category.name}
              </button>
            ))}
            <button
              className="category-button"
              onClick={() => openCategoryModal(note.id)}
            >
              +
            </button>
          </div>
        </>
      )}
    </div>
  ))}
</div>

      {/*modal for add category*/}
      <Modal
  isOpen={addingCategory}
  onRequestClose={() => setAddingCategory(false)}
  contentLabel="Add Category Modal"
  style={{
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: {
      width: '200px',
      margin: 'auto',
      height:'150px',
      padding: '20px',
      borderRadius: '8px',
      backgroundColor: '#333',
    },
  }}
>
  <h2>Add Category</h2>
  <input
    type="text"
    placeholder="Category Name"
    value={newCategoryName}
    onChange={(e) => setNewCategoryName(e.target.value)}
  />
  <div className="edit-buttons">
    <button onClick={confirmAddCategory}>Add</button>
    <button onClick={() => setAddingCategory(false)}>Cancel</button>
  </div>
</Modal>

        
      {/*modal for delete note*/}
      <Modal
        isOpen={deleteModalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Confirm Delete Modal"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          content: {
            width: '200px',
            margin: 'auto',
            padding: '20px',
            borderRadius: '8px',
            backgroundColor: '#242424',
            maxHeight: '200px',
          },
        }}
      >
        <h2>Confirm Delete</h2>
        <p>¿Are you sure?</p>
        <button onClick={confirmDelete}>Accept</button>
        <button onClick={() => setDeleteModalIsOpen(false)}>Cancel</button>
      </Modal>


      {/*modal for select categories in a note*/}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Select Categories Modal"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          content: {
            width: '300px',
            height:'500px',
            margin: 'auto',
            padding: '20px',
            borderRadius: '8px',
            backgroundColor: '#333',
          },
        }}
      >
        <h2>Select Categories</h2>
        <div className="category-buttons">
        {categories.map((category) => (
  <button
    key={category.id}
    className={selectedCategories.includes(category.id) ? 'selected' : ''}
    onClick={() => handleCategorySelection(category.id)}
  >
    {category.name}
  </button>
))}

        </div>
        <button onClick={confirmSaveCategories}>Save</button>
        <button onClick={closeModal}>Cancel</button>
      </Modal>

      {/*modal for archive*/}
      <Modal
        isOpen={archiveModalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Confirm Archive Modal"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          content: {
            width: '200px',
            margin: 'auto',
            padding: '20px',
            borderRadius: '8px',
            backgroundColor: '#242424',
            maxHeight: '200px',
          },
        }}
      >
        <h2>Confirm Archive</h2>
        <p>¿Are you sure?</p>
        <button onClick={confirmArchive}>Accept</button>
        <button onClick={closeModal}>Cancel</button>
      </Modal>

      {/*modal for add note*/}
      <Modal
        isOpen={addingNote}
        onRequestClose={() => setAddingNote(false)}
        contentLabel="Add Note Modal"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          content: {
            width: '200px',
            height:'250px',
            margin: 'auto',
            padding: '20px',
            borderRadius: '8px',
            backgroundColor: '#333',
            maxHeight: '200px',
            overflow: 'hidden'
          },
        }}
      >
        <textarea
          className="edit-textarea"
          value={newNoteDescription}
          onChange={(e) => setNewNoteDescription(e.target.value)}
        />
        <div className="edit-buttons">
          <button onClick={confirmAddNote}>Add</button>
          <button onClick={() => setAddingNote(false)}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default NoteList;
