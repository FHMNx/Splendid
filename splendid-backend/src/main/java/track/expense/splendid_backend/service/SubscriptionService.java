package track.expense.splendid_backend.service;

import track.expense.splendid_backend.dto.SubscriptionDto;
import track.expense.splendid_backend.entity.User;

public interface SubscriptionService {
    void createFreeTrial(User user);
    SubscriptionDto getSubscriptionStatus();
    SubscriptionDto activatePlan(Long userId, String plan);
}
