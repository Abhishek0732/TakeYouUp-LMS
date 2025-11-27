package takeyouup.example.takeyouup.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import takeyouup.example.takeyouup.dto.CourseSummaryDTO;
import takeyouup.example.takeyouup.helper.ApiResponse;
import takeyouup.example.takeyouup.model.Course;
import takeyouup.example.takeyouup.model.CourseModule;
import takeyouup.example.takeyouup.model.Lesson;
import takeyouup.example.takeyouup.service.CourseService;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin
public class CourseController {

    @Autowired
    private CourseService courseService;

    @PostMapping
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        Course createdCourse = courseService.addCourse(course);
        return new ResponseEntity<>(createdCourse, HttpStatus.CREATED);
    }

    @PatchMapping("/{courseId}")
    public ResponseEntity<?> updateCourse(
            @PathVariable Long courseId,
            @RequestBody Course updatedCourseData) {
        try {
            Course updatedCourse = courseService.updateCourse(courseId, updatedCourseData);
            return ResponseEntity.ok(updatedCourse);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating course: " + e.getMessage());
        }
    }

    @PostMapping("/{courseId}/modules/{moduleId}/lessons")
    public ResponseEntity<?> addLessonsToModule(
            @PathVariable Long courseId,
            @PathVariable Long moduleId,
            @RequestBody List<Lesson> lessons) {

        try {
            Course updatedCourse = courseService.addLessonsToModule(courseId, moduleId, lessons);
            return ResponseEntity.status(HttpStatus.CREATED).body(updatedCourse);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding lessons: " + e.getMessage());
        }
    }

    @PutMapping("/{courseId}/modules/{moduleId}/lessons/{lessonId}")
    public ResponseEntity<Course> updateLesson(
            @PathVariable Long courseId,
            @PathVariable Long moduleId,
            @PathVariable Long lessonId,
            @RequestBody Lesson updatedLesson
    ) {
        Course updatedCourse = courseService.updateLessonInModule(courseId, moduleId, lessonId, updatedLesson);
        return ResponseEntity.ok(updatedCourse);
    }

    @DeleteMapping("/{courseId}/modules/{moduleId}/lessons/{lessonId}")
    public ResponseEntity<?> deleteLessonFromModule(
            @PathVariable Long courseId,
            @PathVariable Long moduleId,
            @PathVariable Long lessonId) {

        try {
            courseService.deleteLessonFromModule(courseId, moduleId, lessonId);
            return ResponseEntity.ok("Lesson deleted successfully from module " + moduleId);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting lesson: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCourse(@PathVariable Long id) {
        try {
            courseService.deleteCourse(id);
            return ResponseEntity.ok("Course deleted successfully with id " + id);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Course not found with id " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while deleting the course: " + e.getMessage());
        }
    }

    @PostMapping("/{courseId}/modules")
    public ResponseEntity<?> addModuleToCourse(
            @PathVariable Long courseId,
            @RequestBody List<CourseModule> modules) {

        try {
            Course updatedCourse = courseService.addModuleToCourse(courseId, modules);
            return ResponseEntity.status(HttpStatus.CREATED).body(updatedCourse);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Course not found with id " + courseId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred: " + e.getMessage());
        }
    }

    @PutMapping("/{courseId}/modules/{moduleId}")
    public ResponseEntity<?> updateModule(
            @PathVariable Long courseId,
            @PathVariable Long moduleId,
            @RequestBody CourseModule updatedModule) {

        try {
            Course updatedCourse = courseService.updateModule(courseId, moduleId, updatedModule);
            return ResponseEntity.ok(updatedCourse);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating module: " + e.getMessage());
        }
    }

    @DeleteMapping("/{courseId}/modules/{moduleId}")
    public ResponseEntity<?> deleteModule(
            @PathVariable Long courseId,
            @PathVariable Long moduleId) {
        try {
            courseService.deleteModuleFromCourse(courseId, moduleId);
            return ResponseEntity.ok("Module with id " + moduleId + " deleted successfully from course " + courseId);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting module: " + e.getMessage());
        }
    }

    @GetMapping("/{courseId}/modules")
    public ResponseEntity<?> getModulesByCourseId(@PathVariable Long courseId) {
        try {
            List<CourseModule> modules = courseService.getModulesByCourseId(courseId);
            return ResponseEntity.ok(modules);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching modules: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseById(@PathVariable Long id) {
        Optional<Course> course = courseService.getCourseById(id);
        if (course.isPresent()) {
            return ResponseEntity.ok(course.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(404, "Course not found with id " + id));
        }
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<?> getCourseBySlug(@PathVariable String slug) {
        Optional<Course> course = courseService.findBySlug(slug);
        if (course.isPresent()) {
            return ResponseEntity.ok(course.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(404, "Course not found with slug " + slug));
        }
    }

    @GetMapping("/basic")
    public ResponseEntity<List<CourseSummaryDTO>> getAllCoursesBasic() {
        List<CourseSummaryDTO> courses = courseService.getAllCoursesBasic();
        return ResponseEntity.ok(courses);
    }
}


