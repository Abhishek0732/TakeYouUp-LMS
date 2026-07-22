package takeyouup.example.takeyouup.dto;

/**
 * The result of running a snippet, flattened into one shape.
 *
 * Judge0 splits failure across three fields — {@code stdout}, {@code stderr}
 * and {@code compile_output} — and the caller has to know which to look at.
 * That decision belongs here, not in every component that shows output.
 *
 * @param output what the learner should see: program output, or the compiler
 *               or runtime error if it did not get that far
 * @param status a short human label, e.g. "Accepted", "Compilation Error"
 * @param ok     true when the program ran to completion
 * @param timeMs wall-clock time reported by the runner, null if unknown
 * @param cached whether this came from the result cache rather than a fresh run
 */
public record ExecuteResponse(
        String output,
        String status,
        boolean ok,
        Integer timeMs,
        boolean cached
) {
    public ExecuteResponse asCached() {
        return new ExecuteResponse(output, status, ok, timeMs, true);
    }
}
