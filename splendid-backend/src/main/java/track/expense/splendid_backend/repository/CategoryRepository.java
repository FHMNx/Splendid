package track.expense.splendid_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import track.expense.splendid_backend.entity.Category;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByType(Category.CategoryType type);
}