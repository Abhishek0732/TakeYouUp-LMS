package takeyouup.example.takeyouup.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import takeyouup.example.takeyouup.model.Lesson;

import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {

    /** Lesson ids for a course in a single projection query (no entity graph load). */
    @Query("select l.id from Lesson l where l.module.course.id = :courseId")
    List<Long> findLessonIdsByCourseId(@Param("courseId") Long courseId);

    /**
     * Every lesson across the whole catalogue as [courseId, lessonId, slug, title],
     * ordered so the first unfinished row per course is the natural "next" one.
     * One query for the entire profile page instead of one per course.
     */
    @Query("""
        select l.module.course.id, l.id, l.slug, l.title
        from Lesson l
        order by l.module.course.id, l.module.id, l.id
    """)
    List<Object[]> findAllLessonRows();
}
