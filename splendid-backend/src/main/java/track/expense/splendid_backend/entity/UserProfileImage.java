package track.expense.splendid_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "user_profile")
public class UserProfileImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false ,  unique = true)
    private User user;

    @Column(nullable = false)
    private String imageUrl;

    @Column(nullable = false)
    private String publicId;

    @Column(nullable = false)
    private LocalDateTime uploadedAt;

    @PrePersist
    public void prePersist(){
        this.uploadedAt = LocalDateTime.now();
    }
}
