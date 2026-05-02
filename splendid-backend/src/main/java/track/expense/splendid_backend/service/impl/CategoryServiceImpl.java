package track.expense.splendid_backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import track.expense.splendid_backend.entity.Category;
import track.expense.splendid_backend.repository.CategoryRepository;
import track.expense.splendid_backend.service.CategoryService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<Category> getCategoriesByType(String type) {
       Category.CategoryType categoryType = Category.CategoryType.valueOf(type.toUpperCase());
       return categoryRepository.findByType(categoryType);
    }
}
