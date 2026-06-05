package track.expense.splendid_backend.configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Splendid Expense Tracker API")
                        .version("1.0.0")
                        .description("""
                                REST API for Splendid — a personal finance and expense tracking system.
                                
                                ## Features
                                - User authentication with JWT
                                - Email verification and password reset
                                - Transaction management (income & expenses)
                                - Budget goals with progress tracking
                                - Subscription management with PayHere payment gateway
                                - Admin panel for platform management
                                - AI-powered finance assistant (Penny)
                                
                                ## Authentication
                                Most endpoints require a Bearer JWT token.
                                Login first using POST /api/auth/login to get your token,
                                then click the Authorize button and paste: Bearer <your_token>
                                """)
                        .contact(new Contact()
                                .name("Abdullah Fahman")
                                .email("fahmaanx@gmail.com"))
                        .license(new License()
                                .name("MIT License")))
                .addSecurityItem(new SecurityRequirement()
                        .addList("Bearer Authentication"))
                .components(new Components()
                        .addSecuritySchemes("Bearer Authentication",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Enter your JWT token obtained from POST /api/auth/login")));
    }
}