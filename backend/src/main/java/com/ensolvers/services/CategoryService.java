package com.ensolvers.services;


import com.ensolvers.entities.Category;
import com.ensolvers.entities.Note;
import com.ensolvers.repositories.CategoryRepository;
import com.ensolvers.repositories.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {


    @Autowired
    private CategoryRepository categoryRepository;

    public Category findByName(String categoryName) {
        return categoryRepository.findByName(categoryName);
    }


    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }


    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }



}
