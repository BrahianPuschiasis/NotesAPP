class NoteService {
    async getAllNotes() {
      try {
        const response = await fetch('http://localhost:8080/note/all');
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching notes:', error);
        throw error;
      }
    }

    async getAllCategories() {
      try {
        const response = await fetch('http://localhost:8080/category/all');
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
    }
  
    async addNote(newNote) {
      try {
        const response = await fetch('http://localhost:8080/note/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newNote),
        });
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error adding note:', error);
        throw error;
      }
    }
  
    async deleteNote(noteId) {
      try {
        await fetch(`http://localhost:8080/note/${noteId}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Error deleting note:', error);
        throw error;
      }
    }
    async updateNote(updatedNote) {
        try {
          await fetch('http://localhost:8080/note/update', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedNote),
          });
      
          return { success: true };
        } catch (error) {
          console.error('Error updating note:', error);
          return { success: false, error: 'Failed to update note' };
        }
      }
      
      
      
      
  
    async archiveNote(noteId) {
      try {
        await fetch(`http://localhost:8080/note/archived/${noteId}`, {
          method: 'PUT',
        });
      } catch (error) {
        console.error('Error archiving note:', error);
        throw error;
      }
    }

    async getCategoriesForNote(noteId) {
      try {
        const response = await fetch(`http://localhost:8080/note/${noteId}/categories`);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching categories for note:', error);
        throw error;
      }
    }


    

    
     async createCategory(categoryData) {
      try {
        const response = await fetch('http://localhost:8080/category', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(categoryData),
        });
  
        if (!response.ok) {
          throw new Error('Failed to create category');
        }
  
        return response.json();
      } catch (error) {
        console.error('Error creating category:', error);
        throw error;
      }
    }

    async deleteCategoriesFromNote(noteId, categoryIds) {
      try {
        const response = await fetch(`http://localhost:8080/note/${noteId}/removeCategories`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(categoryIds),
        });
    
        if (!response.ok) {
          throw new Error('Failed to delete categories from note');
        }
    
      } catch (error) {
        console.error('Error deleting categories from note:', error);
        throw error;
      }
    }
    
    
    async addCategoriesToNote(noteId, categoryIds) {
       try {

    
        const response = await fetch(`http://localhost:8080/note/${noteId}/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(categoryIds),
        });
    
        if (!response.ok) {
          throw new Error('Failed to add categories to note');
        }
    

      } catch (error) {
        console.error('Error adding categories to note:', error);
        throw error;
      }
    }
    
    


  }
 
  
  export default new NoteService();
  