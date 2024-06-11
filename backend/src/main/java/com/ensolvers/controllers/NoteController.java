package com.ensolvers.controllers;


import com.ensolvers.entities.Category;
import com.ensolvers.entities.Note;
import com.ensolvers.services.CategoryService;
import com.ensolvers.services.NoteService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/note")
@CrossOrigin
public class NoteController {


    @Autowired
    private NoteService noteService;

    @Autowired
    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    //endpoint for create a note
    @PostMapping("/create")
    public ResponseEntity<Note> createNote(@RequestBody Note note) {
        Note createdNote = noteService.saveNote(note);
        return new ResponseEntity<>(createdNote, HttpStatus.CREATED);
    }

    //endpoint for find by id
    @GetMapping("/{id}")
    public ResponseEntity<?> getNoteById(@PathVariable Long id) {
        Optional<Note> optionalNote = noteService.getNoteById(id);

        if (optionalNote.isPresent()) {
            return new ResponseEntity<>(optionalNote.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Note not found", HttpStatus.NOT_FOUND);
        }
    }


    //endpoint for update
    @PutMapping("/update")
    public ResponseEntity<Void> updateNote(@RequestBody Note note) {
        noteService.updateNote(note);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    //endpoint for delete by id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        noteService.deleteNoteByID(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Endpoint to toggle the archived status of a note by ID
    @PutMapping("/archived/{id}")
    public ResponseEntity<Void> toggleArchivedStatus(@PathVariable Long id) {
        noteService.toggleArchivedStatus(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }


    //endpoint for get all archived notes
    @GetMapping("/archived")
    public ResponseEntity<List<Note>> getArchivedNotes() {
        List<Note> archivedNotes = noteService.getArchivedNotes();
        return new ResponseEntity<>(archivedNotes, HttpStatus.OK);
    }

    //endpoint for get all non archived notes
    @GetMapping("/active")
    public ResponseEntity<List<Note>> getActiveNotes() {
        List<Note> activeNotes = noteService.getActiveNotes();
        return new ResponseEntity<>(activeNotes, HttpStatus.OK);
    }

    //endpoint for get all notes
    @GetMapping("/all")
    public ResponseEntity<List<Note>> getAllNotes() {
        List<Note> allNotes = noteService.getAllNotes();
        return new ResponseEntity<>(allNotes, HttpStatus.OK);
    }


    //need be an array, not a jason, for example: [7, 9]
    @PostMapping("/{noteId}/categories")
    public ResponseEntity<Note> addCategoriesToNote(
            @PathVariable Long noteId,
            @RequestBody List<Long> categoryIds
    ) {
        try {
            Note updatedNote = noteService.addCategoriesToNote(noteId, categoryIds);
            return ResponseEntity.ok(updatedNote);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    //show all the categories relational to a specific note
    @GetMapping("/{noteId}/categories")
    public ResponseEntity<Set<Category>> getCategoriesByNoteId(@PathVariable Long noteId) {
        Set<Category> categories = noteService.getCategoriesByNoteId(noteId);
        return ResponseEntity.ok(categories);
    }

    //need be an array, not a jason, for example: [7, 9]
@PutMapping("/{noteId}/removeCategories")
public ResponseEntity<String> removeCategoriesFromNote(
        @PathVariable Long noteId,
        @RequestBody List<Long> categoryIds) {
    try {
        noteService.removeCategoriesFromNote(noteId, categoryIds);
        return ResponseEntity.ok("Categories removed successfully.");
    } catch (EntityNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Note not found.");
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred.");
    }
}




}


