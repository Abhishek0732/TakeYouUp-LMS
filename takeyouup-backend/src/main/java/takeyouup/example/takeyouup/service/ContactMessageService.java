package takeyouup.example.takeyouup.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import takeyouup.example.takeyouup.model.ContactMessage;
import takeyouup.example.takeyouup.repository.ContactMessageRepository;

@Service
public class ContactMessageService {

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @Autowired
    private EmailService emailService;

    public ContactMessage saveContactMessage(ContactMessage contactMessage) {
        ContactMessage savedMessage = contactMessageRepository.save(contactMessage);

        emailService.sendConfirmationEmail(savedMessage.getEmail(), savedMessage.getName());
        return savedMessage;
    }
}
