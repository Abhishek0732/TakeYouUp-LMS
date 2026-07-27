package takeyouup.example.takeyouup.repository.team;

import org.springframework.data.jpa.repository.JpaRepository;
import takeyouup.example.takeyouup.model.team.TeamMember;

import java.util.List;
import java.util.UUID;

public interface TeamMemberRepository extends JpaRepository<TeamMember, UUID> {

    /** The roster in display order — the About page and the admin grid both use this. */
    List<TeamMember> findAllByOrderBySortOrderAscNameAsc();
}
