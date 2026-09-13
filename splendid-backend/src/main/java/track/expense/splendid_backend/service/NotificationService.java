package track.expense.splendid_backend.service;

import track.expense.splendid_backend.dto.BroadcastRequestDto;
import track.expense.splendid_backend.dto.NotificationResponseDto;

import java.util.List;

public interface NotificationService {

    List<NotificationResponseDto> getUserNotifications();

    long getUnreadCount();

    void markAsRead(Long id);

    void markAllAsRead();

    void sendBroadcast(BroadcastRequestDto request);
}
