-- Lesson bodies now carry Markdown with fenced code blocks (```java … ```),
-- which blows well past the old varchar(5000) limit.
ALTER TABLE lesson MODIFY COLUMN content LONGTEXT NULL;

-- Quiz questions are stored as JSON in quiz.questions_json, so the new
-- per-question `codeSnippet` / `codeLanguage` keys need no column change.
-- Older rows simply omit them and deserialize to null.
