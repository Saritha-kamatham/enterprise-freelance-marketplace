package com.enterprise.marketplace.repository;

import com.enterprise.marketplace.domain.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByContractIdOrderByTimestampAsc(Long contractId);
    
    @Query("SELECT m FROM Message m WHERE " +
           "((m.sender.id = :user1Id AND m.receiver.id = :user2Id) OR " +
           "(m.sender.id = :user2Id AND m.receiver.id = :user1Id)) " +
           "AND (:contractId IS NULL OR m.contract.id = :contractId) " +
           "ORDER BY m.timestamp ASC")
    List<Message> findChatHistory(@Param("user1Id") Long user1Id, 
                                  @Param("user2Id") Long user2Id, 
                                  @Param("contractId") Long contractId);
}
