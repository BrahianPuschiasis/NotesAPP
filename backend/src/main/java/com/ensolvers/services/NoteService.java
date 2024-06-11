package com.ensolvers.services;

import com.ensolvers.entities.Category;
import com.ensolvers.entities.Note;
import com.ensolvers.repositories.NoteRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private CategoryService categoryService;


    //save note
    public Note saveNote(Note note){
        //check if the category already exists
        Set<Category> categoryNew = new HashSet<>();
        for (Category category : note.getCategories()) {
            Category categoryExists = categoryService.findByName(category.getName());
            if (categoryExists != null) {
                categoryNew.add(categoryExists);
            } else {
                categoryNew.add(categoryService.saveCategory(category));
            }
        }

        //save categorys to note a
        note.setCategories(categoryNew);
        return noteRepository.save(note);
    }

    //delete note
    public void deleteNoteByID(Long noteID) {
        Optional<Note> optionalNote = noteRepository.findById(noteID);

        if (optionalNote.isPresent()) {
            Note note = optionalNote.get();

            //manual deleting the relationed categories
            note.getCategories().clear();

            //save it
            noteRepository.save(note);

            //now delete note
            noteRepository.deleteById(noteID);
        } else {
            //id note not exists
            throw new EntityNotFoundException("Note with ID " + noteID + " not found");
        }
    }

    //update note
    public void updateNote(Note updatedNote) {
        Optional<Note> existingNoteOptional = noteRepository.findById(updatedNote.getId());

        if (existingNoteOptional.isPresent()) {
            Note existingNote = existingNoteOptional.get();

            //update only if given
            if (updatedNote.getDescription() != null) {
                existingNote.setDescription(updatedNote.getDescription());
            }

            //update only if given
            if (updatedNote.getArchived() != null) {
                existingNote.setArchived(updatedNote.getArchived());
            }

            //keep categories untouch
            existingNote.setCategories(existingNote.getCategories());


            //save changes
            noteRepository.save(existingNote);
        } else {
            //if the note not exists
            throw new EntityNotFoundException("Note with ID " + updatedNote.getId() + " not found");
        }
    }


    //get note by id
    public Optional<Note> getNoteById(Long id) {
        return noteRepository.findById(id);
    }

    //function for toggle between archived and active notes
    public void toggleArchivedStatus(Long id) {
        Optional<Note> optionalNote = noteRepository.findById(id);

        if (optionalNote.isPresent()) {
            Note note = optionalNote.get();
            //toggle status
            note.setArchived(!note.getArchived());
            // save the note updated
            noteRepository.save(note);
        }
    }

    //find all archived notes
    public List<Note> getArchivedNotes() {
        return noteRepository.findByArchived(true);
    }

    //find all non archived notes
    public List<Note> getActiveNotes() {
        return noteRepository.findByArchived(false);
    }

    //find all notes
    public List<Note> getAllNotes() {
        return noteRepository.findAll();
    }


    public Note addCategoriesToNote(Long noteId, List<Long> categoryIds) {
        Optional<Note> optionalNote = noteRepository.findById(noteId);

        if (optionalNote.isPresent()) {
            Note note = optionalNote.get();
            Set<Category> categories = note.getCategories();

            for (Long categoryId : categoryIds) {
                Optional<Category> optionalCategory = categoryService.getCategoryById(categoryId);

                if (optionalCategory.isPresent()) {
                    //category exists, adding it
                    categories.add(optionalCategory.get());
                } else {
                    //if the category dont exists
                    throw new EntityNotFoundException("Category with ID" + categoryId + " not found");
                }
            }

            //update the note
            return noteRepository.save(note);
        } else {
            //if the note with the id doesnt exists
            throw new EntityNotFoundException("Note with ID " + noteId + " not found");
        }
    }


    public Set<Category> getCategoriesByNoteId(Long noteId) {
        Optional<Note> optionalNote = noteRepository.findById(noteId);

        if (optionalNote.isPresent()) {
            Note note = optionalNote.get();
            return note.getCategories();
        } else {
            throw new EntityNotFoundException("Note with ID " + noteId + " not found");
        }
    }

    //function for remove specifics categories from a note
    public Note removeCategoriesFromNote(Long noteId, List<Long> categoryIds) {
        Optional<Note> optionalNote = noteRepository.findById(noteId);

        if (optionalNote.isPresent()) {
            Note note = optionalNote.get();
            Set<Category> categories = note.getCategories();

            for (Long categoryId : categoryIds) {
                Optional<Category> optionalCategory = categoryService.getCategoryById(categoryId);

                if (optionalCategory.isPresent()) {
                    //if the category exists, delete it
                    categories.remove(optionalCategory.get());
                } else {

                    // throw new EntityNotFoundException("Category with ID " + categoryId + " not found");
                }
            }

            //update the note
            return noteRepository.save(note);
        } else {
            throw new EntityNotFoundException("Note with ID " + noteId + " not found");
        }
    }



}
