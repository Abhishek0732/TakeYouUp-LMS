package takeyouup.example.takeyouup.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import takeyouup.example.takeyouup.dto.CourseSummaryDTO;
import takeyouup.example.takeyouup.model.Course;
import takeyouup.example.takeyouup.model.CourseModule;
import takeyouup.example.takeyouup.model.KeyPoint;
import takeyouup.example.takeyouup.model.Lesson;
import takeyouup.example.takeyouup.repository.CourseRepository;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public Course addCourse(Course course) {
        if (course.getModules() != null) {
            for (CourseModule module : course.getModules()) {
                module.setCourse(course);
                if (module.getLessons() != null) {
                    for (Lesson lesson : module.getLessons()) {
                        lesson.setModule(module);
                        if (lesson.getKeyPoints() != null) {
                            for (KeyPoint keyPoint : lesson.getKeyPoints()) {
                                keyPoint.setLesson(lesson);
                            }
                        }
                    }
                }
            }
        }

        return courseRepository.save(course);
    }

    public Course updateCourse(Long courseId, Course updatedCourseData) {
        Course existingCourse = courseRepository.findById(courseId)
                .orElseThrow(() -> new NoSuchElementException("Course not found with id " + courseId));

        if (updatedCourseData.getCourseId() != null)
            existingCourse.setCourseId(updatedCourseData.getCourseId());

        if (updatedCourseData.getSlug() != null)
            existingCourse.setSlug(updatedCourseData.getSlug());

        if (updatedCourseData.getTitle() != null)
            existingCourse.setTitle(updatedCourseData.getTitle());

        if (updatedCourseData.getDescription() != null)
            existingCourse.setDescription(updatedCourseData.getDescription());

        if (updatedCourseData.getCategory() != null)
            existingCourse.setCategory(updatedCourseData.getCategory());

        if (updatedCourseData.getLevel() != null)
            existingCourse.setLevel(updatedCourseData.getLevel());

        if (updatedCourseData.getDuration() != null)
            existingCourse.setDuration(updatedCourseData.getDuration());

        if (updatedCourseData.getStudents() != 0)
            existingCourse.setStudents(updatedCourseData.getStudents());

        if (updatedCourseData.getRating() != 0)
            existingCourse.setRating(updatedCourseData.getRating());

        if (updatedCourseData.getImage() != null)
            existingCourse.setImage(updatedCourseData.getImage());

        if (updatedCourseData.getInstructor() != null)
            existingCourse.setInstructor(updatedCourseData.getInstructor());

        if (updatedCourseData.getPrice() != null)
            existingCourse.setPrice(updatedCourseData.getPrice());

        return courseRepository.save(existingCourse);
    }

    public Course addLessonToModule(Long courseId, Long moduleId, Lesson lesson) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new NoSuchElementException("Course not found with id " + courseId));

        CourseModule module = course.getModules().stream()
                .filter(m -> m.getId().equals(moduleId))
                .findFirst()
                .orElseThrow(() -> new NoSuchElementException("Module not found with id " + moduleId));

        lesson.setModule(module);
        if (lesson.getKeyPoints() != null) {
            for (KeyPoint keyPoint : lesson.getKeyPoints()) {
                keyPoint.setLesson(lesson);
            }
        }

        module.getLessons().add(lesson);

        return courseRepository.save(course);
    }

    public Course addLessonsToModule(Long courseId, Long moduleId, List<Lesson> lessons) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new NoSuchElementException("Course not found with id " + courseId));

        CourseModule module = course.getModules().stream()
                .filter(m -> m.getId().equals(moduleId))
                .findFirst()
                .orElseThrow(() -> new NoSuchElementException("Module not found with id " + moduleId));

        for (Lesson lesson : lessons) {
            lesson.setModule(module);
            lesson.setSlug(
                    lesson.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-")
            );

            if (lesson.getKeyPoints() != null) {
                for (KeyPoint keyPoint : lesson.getKeyPoints()) {
                    keyPoint.setLesson(lesson);
                }
            }

            module.getLessons().add(lesson);
        }

        return courseRepository.save(course);
    }

    public Course updateLessonInModule(Long courseId, Long moduleId, Long lessonId, Lesson updatedLesson) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new NoSuchElementException("Course not found with id " + courseId));

        CourseModule module = course.getModules().stream()
                .filter(m -> m.getId().equals(moduleId))
                .findFirst()
                .orElseThrow(() -> new NoSuchElementException("Module not found with id " + moduleId));

        Lesson lesson = module.getLessons().stream()
                .filter(l -> l.getId().equals(lessonId))
                .findFirst()
                .orElseThrow(() -> new NoSuchElementException("Lesson not found with id " + lessonId));

        Optional.ofNullable(updatedLesson.getTitle()).ifPresent(title -> {
            lesson.setTitle(title);
            lesson.setSlug(title.toLowerCase().replaceAll("[^a-z0-9]+", "-"));
        });

        Optional.ofNullable(updatedLesson.getDuration()).ifPresent(lesson::setDuration);
        Optional.ofNullable(updatedLesson.getContent()).ifPresent(lesson::setContent);

        if (updatedLesson.getKeyPoints() != null) {
            if (!updatedLesson.getKeyPoints().isEmpty()) {
                lesson.getKeyPoints().clear();
                for (KeyPoint keyPoint : updatedLesson.getKeyPoints()) {
                    keyPoint.setLesson(lesson);
                    lesson.getKeyPoints().add(keyPoint);
                }
            }
        }

        return courseRepository.save(course);
    }


    public void deleteLessonFromModule(Long courseId, Long moduleId, Long lessonId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new NoSuchElementException("Course not found with id " + courseId));

        CourseModule module = course.getModules().stream()
                .filter(m -> m.getId().equals(moduleId))
                .findFirst()
                .orElseThrow(() -> new NoSuchElementException("Module not found with id " + moduleId));

        Lesson lessonToRemove = module.getLessons().stream()
                .filter(l -> l.getId().equals(lessonId))
                .findFirst()
                .orElseThrow(() -> new NoSuchElementException("Lesson not found with id " + lessonId));

        module.getLessons().remove(lessonToRemove);

        courseRepository.save(course);
    }


    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Course not found with id " + id));

        courseRepository.delete(course);
    }

    public Course addModuleToCourse(Long courseId, List<CourseModule> modules) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new NoSuchElementException("Course not found with id " + courseId));

        for (CourseModule module : modules) {
            module.setCourse(course);
            if (module.getLessons() != null) {
                for (Lesson lesson : module.getLessons()) {
                    lesson.setModule(module);
                    if (lesson.getKeyPoints() != null) {
                        for (KeyPoint keyPoint : lesson.getKeyPoints()) {
                            keyPoint.setLesson(lesson);
                        }
                    }
                }
            }
            course.getModules().add(module);
        }

        return courseRepository.save(course);
    }

    public Course updateModule(Long courseId, Long moduleId, CourseModule updatedModuleData) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new NoSuchElementException("Course not found with id " + courseId));

        CourseModule existingModule = course.getModules().stream()
                .filter(m -> m.getId().equals(moduleId))
                .findFirst()
                .orElseThrow(() -> new NoSuchElementException("Module not found with id " + moduleId));

        existingModule.setTitle(updatedModuleData.getTitle());

        if (updatedModuleData.getLessons() != null && !updatedModuleData.getLessons().isEmpty()) {
            existingModule.getLessons().clear();
            for (Lesson lesson : updatedModuleData.getLessons()) {
                lesson.setModule(existingModule);
                if (lesson.getKeyPoints() != null) {
                    for (KeyPoint keyPoint : lesson.getKeyPoints()) {
                        keyPoint.setLesson(lesson);
                    }
                }
                existingModule.getLessons().add(lesson);
            }
        }

        return courseRepository.save(course);
    }

    public void deleteModuleFromCourse(Long courseId, Long moduleId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new NoSuchElementException("Course not found with id " + courseId));

        CourseModule moduleToRemove = course.getModules().stream()
                .filter(m -> m.getId().equals(moduleId))
                .findFirst()
                .orElseThrow(() -> new NoSuchElementException("Module not found with id " + moduleId));

        course.getModules().remove(moduleToRemove);
        courseRepository.save(course);
    }

    public List<CourseModule> getModulesByCourseId(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new NoSuchElementException("Course not found with id " + courseId));

        return course.getModules();
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    public Optional<Course> findBySlug(String slug) {
        return courseRepository.findBySlug(slug);
    }

    public List<CourseSummaryDTO> getAllCoursesBasic() {
        List<Course> courses = courseRepository.findAll();

        return courses.stream()
                .map(course -> new CourseSummaryDTO(
                        course.getId(),
                        course.getCourseId(),
                        course.getSlug(),
                        course.getTitle(),
                        course.getDescription(),
                        course.getCategory(),
                        course.getLevel(),
                        course.getDuration(),
                        course.getStudents(),
                        course.getRating(),
                        course.getImage(),
                        course.getInstructor(),
                        course.getPrice()
                ))
                .toList();
    }

}

