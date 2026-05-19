package track.expense.splendid_backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import track.expense.splendid_backend.dto.SubscriptionDto;
import track.expense.splendid_backend.entity.Subscription;
import track.expense.splendid_backend.entity.User;
import track.expense.splendid_backend.exception.ResourceNotFoundException;
import track.expense.splendid_backend.repository.SubscriptionRepository;
import track.expense.splendid_backend.repository.UserRepository;
import track.expense.splendid_backend.service.SubscriptionService;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;

    @Override
    public void createFreeTrial(User user) {
        LocalDate today = LocalDate.now();

        Subscription subscription = Subscription.builder()
                .user(user)
                .plan(Subscription.Plan.FREE_TRIAL)
                .status(Subscription.Status.ACTIVE)
                .startDate(today)
                .endDate(today.plusDays(7))
                .build();
        subscriptionRepository.save(subscription);
    }

    @Override
    public SubscriptionDto getSubscriptionStatus() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Subscription subscription = subscriptionRepository.findByUser(user).orElseThrow(() -> new ResourceNotFoundException("Subscription not found"));
        return buildDto(subscription);
    }

    @Override
    public SubscriptionDto activatePlan(Long userId, String plan) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Subscription subscription = subscriptionRepository.findByUser(user).orElse(Subscription.builder().user(user).build());

        LocalDate today = LocalDate.now();
        Subscription.Plan selectedPlan = Subscription.Plan.valueOf(plan.toUpperCase());

        int days = switch (selectedPlan) {
            case FREE_TRIAL -> 7;
            case MONTHLY -> 30;
            case HALF_YEARLY -> 180;
            case YEARLY -> 365;
        };

        subscription.setPlan(selectedPlan);
        subscription.setStatus(Subscription.Status.ACTIVE);
        subscription.setEndDate(today.plusDays(days));
        subscription.setStartDate(today);

        subscriptionRepository.save(subscription);
        return buildDto(subscription);
    }


    private SubscriptionDto buildDto(Subscription subscription) {
        LocalDate today = LocalDate.now();

        // auto-expire if endDate has passed
        if (subscription.getEndDate().isBefore(today) && subscription.getStatus() == Subscription.Status.ACTIVE) {
            subscription.setStatus(Subscription.Status.EXPIRED);
            subscriptionRepository.save(subscription);
        }

        long daysRemaining = Math.max(0, ChronoUnit.DAYS.between(today, subscription.getEndDate()));
        boolean isActive = subscription.getStatus() == Subscription.Status.ACTIVE;

        return SubscriptionDto.builder()
                .id(subscription.getId())
                .plan(subscription.getPlan().name())
                .status(subscription.getStatus().name())
                .startDate(subscription.getStartDate())
                .endDate(subscription.getEndDate())
                .daysRemaining(daysRemaining)
                .isActive(isActive)
                .build();
    }
}
