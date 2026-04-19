package track.expense.splendid_backend.mapper;

import track.expense.splendid_backend.dto.TransactionDto;
import track.expense.splendid_backend.entity.Transaction;

public class TransactionMapper {

    // ENTITY => DTO
    public static TransactionDto toDto(Transaction transaction) {
        if (transaction == null) {
            return null;
        }

        return TransactionDto.builder()
                .id(transaction.getId())
                .title(transaction.getTitle())
                .amount(transaction.getAmount())
                .type(transaction.getType().name())
                .date(transaction.getDate())
                .paymentMethod(transaction.getPaymentMethod().name())
                .notes(transaction.getNotes())
                .categoryId(transaction.getCategoryId())
                .build();
    }


    // DTO => ENTITY
    public static Transaction toEntity(TransactionDto transactionDto) {
        if (transactionDto == null) return null;

        Transaction transaction = new Transaction();

        transaction.setId(transactionDto.getId());
        transaction.setTitle(transactionDto.getTitle());
        transaction.setAmount(transactionDto.getAmount());
        transaction.setDate(transactionDto.getDate());
        // Convert String → Enum
        transaction.setType(Transaction.TransactionType.valueOf(transactionDto.getType().toUpperCase()));
        transaction.setPaymentMethod(Transaction.PaymentMethod.valueOf(transactionDto.getPaymentMethod().toUpperCase()));
        transaction.setNotes(transactionDto.getNotes());
        transaction.setCategoryId(transactionDto.getCategoryId());

        return transaction;
    }

}
