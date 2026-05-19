package track.expense.splendid_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import track.expense.splendid_backend.entity.Subscription;
import track.expense.splendid_backend.entity.User;

import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    Optional<Subscription> findByUser(User user);
}
