package takeyouup.example.takeyouup.service;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import takeyouup.example.takeyouup.event.ContactMessageEvent;
import takeyouup.example.takeyouup.model.ContactMessage;
import takeyouup.example.takeyouup.repository.ContactMessageRepository;

@Service
public class ContactMessageService {

    private final ContactMessageRepository contactMessageRepository;

    private final ApplicationEventPublisher eventPublisher;

    public ContactMessageService(ContactMessageRepository contactMessageRepository, ApplicationEventPublisher eventPublisher) {
        this.contactMessageRepository = contactMessageRepository;
        this.eventPublisher = eventPublisher;
    }

    public ContactMessage saveContactMessage(ContactMessage contactMessage) {
        ContactMessage savedMessage = contactMessageRepository.save(contactMessage);

        eventPublisher.publishEvent(
                new ContactMessageEvent(
                        savedMessage.getEmail(),
                        savedMessage.getName()
                )
        );

        return savedMessage;
    }
}
