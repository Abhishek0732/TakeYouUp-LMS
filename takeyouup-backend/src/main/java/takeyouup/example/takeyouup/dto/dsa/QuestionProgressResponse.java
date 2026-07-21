package takeyouup.example.takeyouup.dto.dsa;

import java.util.Map;

/**
 * "You have solved 7 of 18 problems" for the current user, broken down by
 * difficulty so the problems page can show a per-bucket bar.
 *
 * @param total        every question in the catalogue
 * @param solved       questions this user has marked solved
 * @param percent      solved/total as a whole number, 0 when the catalogue is empty
 * @param byDifficulty level -> {@link Bucket}, ordered Easy, Medium, Hard
 */
public record QuestionProgressResponse(
        long total,
        long solved,
        int percent,
        Map<String, Bucket> byDifficulty,
        Streak streak
) {
    public record Bucket(long total, long solved) {}

    /**
     * Daily solving streak.
     *
     * @param current    consecutive days up to today (or yesterday, so the
     *                   streak survives until the day is actually missed)
     * @param longest    best run ever recorded
     * @param solvedToday whether anything was solved today
     * @param lastDays   most recent 14 days, oldest first, true = active
     */
    public record Streak(int current, int longest, boolean solvedToday, java.util.List<Boolean> lastDays) {}
}
