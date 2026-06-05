package track.expense.splendid_backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import track.expense.splendid_backend.dto.CategoryDto;
import track.expense.splendid_backend.entity.Category;
import track.expense.splendid_backend.service.CategoryService;

import java.util.List;
import java.util.stream.Collectors;

@Tag(name = "Categories", description = "Get expense and income categories")
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @Operation(summary = "Get categories by type", description = "Type must be INCOME or EXPENSE")
    @GetMapping("/type/{type}")
    public ResponseEntity<List<CategoryDto>> getByType(@PathVariable String type) {
        List<Category> categories = categoryService.getCategoriesByType(type);

        // Map entities to DTOs to prevent Swagger infinite recursion crashes
        List<CategoryDto> categoryDtos = categories.stream()
                .map(c -> new CategoryDto(c.getId(), c.getName()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(categoryDtos);
    }
}