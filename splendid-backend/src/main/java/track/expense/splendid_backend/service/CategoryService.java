package track.expense.splendid_backend.service;

import track.expense.splendid_backend.entity.Category;

import java.util.List;

public interface CategoryService {
    List<Category> getCategoriesByType(String type);
}
