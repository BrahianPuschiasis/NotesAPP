package com.ensolvers.controllers;


import com.ensolvers.entities.Category;
import com.ensolvers.entities.Note;
import com.ensolvers.repositories.CategoryRepository;
import com.ensolvers.services.CategoryService;
import com.ensolvers.services.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/category")
@CrossOrigin
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    //endpoint for all categories
    @GetMapping("/all")
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> allCategories = categoryService.getAllCategories();
        return new ResponseEntity<>(allCategories, HttpStatus.OK);
    }


    @PostMapping
    public ResponseEntity<Category> saveCategory(@RequestBody Category category) {
        String categoryName = category.getName();
        Category existingCategory = categoryService.findByName(categoryName);

        if (existingCategory != null) {

            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        Category savedCategory = categoryService.saveCategory(category);
        return ResponseEntity.ok(savedCategory);
    }

}
