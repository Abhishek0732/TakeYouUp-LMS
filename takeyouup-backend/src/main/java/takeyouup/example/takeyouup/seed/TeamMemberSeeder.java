package takeyouup.example.takeyouup.seed;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import takeyouup.example.takeyouup.model.team.TeamMember;
import takeyouup.example.takeyouup.repository.team.TeamMemberRepository;

/**
 * Seeds the one team member the About page shipped with, so a fresh install
 * still shows a roster. Idempotent: only runs when the table is empty, so an
 * admin's later edits are never overwritten. The photo is left null (the card
 * renders an initials avatar) — an admin uploads the real picture from the
 * Team tab, since a migration cannot place a file in the uploads volume.
 */
@Slf4j
@Component
@Order(4)
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.seed.content.enabled", havingValue = "true", matchIfMissing = true)
public class TeamMemberSeeder implements ApplicationRunner {

    private final TeamMemberRepository repository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (repository.count() > 0) {
            return;
        }
        repository.save(TeamMember.builder()
                .name("Abhishek Verma")
                .role("Founder & CEO")
                .bio("Software Engineer")
                .sortOrder(1)
                .build());
        log.info("Seeded initial team member");
    }
}
