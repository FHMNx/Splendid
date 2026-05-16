package track.expense.splendid_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import track.expense.splendid_backend.entity.User;
import track.expense.splendid_backend.entity.UserProfileImage;

import java.util.Optional;

public interface UserProfileImageRepository extends JpaRepository<UserProfileImage, Long> {
    Optional<UserProfileImage> findByUser(User user);
}