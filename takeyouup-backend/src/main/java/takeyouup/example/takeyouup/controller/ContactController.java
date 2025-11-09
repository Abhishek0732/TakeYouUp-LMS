package takeyouup.example.takeyouup.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import takeyouup.example.takeyouup.model.ContactMessage;
import takeyouup.example.takeyouup.service.ContactMessageService;

@RestController
@RequestMapping("/api/contacts")
@CrossOrigin
public class ContactController {

    @Autowired
    private ContactMessageService contactMessageService;

    @PostMapping
    public ContactMessage saveContactMessage(@RequestBody ContactMessage contactMessage) {
        System.out.println(contactMessage);
        return contactMessageService.saveContactMessage(contactMessage);
    }
}
