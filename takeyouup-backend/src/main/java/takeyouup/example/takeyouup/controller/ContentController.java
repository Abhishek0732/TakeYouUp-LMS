package takeyouup.example.takeyouup.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import takeyouup.example.takeyouup.model.content.ContentItem;
import takeyouup.example.takeyouup.model.content.SiteText;
import takeyouup.example.takeyouup.repository.content.ContentItemRepository;
import takeyouup.example.takeyouup.repository.content.SiteTextRepository;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Editable site copy: the lists and one-off strings that used to be literals in
 * the React components.
 *
 * The public GET is a single request returning everything the marketing pages
 * need, grouped by section. One round trip on first paint beats six, and the
 * payload is small — a few kilobytes of text that changes rarely, so it is
 * marked cacheable.
 *
 * Writes are admin-only through the blanket POST/PUT/DELETE rules in
 * SecurityConfig; nothing here grants access on its own.
 */
@RestController
@RequestMapping("/api/content")
@CrossOrigin
public class ContentController {

    @Autowired private ContentItemRepository itemRepository;
    @Autowired private SiteTextRepository textRepository;

    /* ─────────────────────────────── public ─────────────────────────────── */

    /**
     * Everything the site renders, in one response:
     * {@code { items: { SECTION: [...] }, text: { key: value } }}.
     * Inactive rows are omitted — that is what the active flag is for.
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> publicContent() {
        Map<String, List<ContentItem>> grouped = itemRepository
                .findByActiveTrueOrderBySectionAscSortOrderAsc()
                .stream()
                .collect(Collectors.groupingBy(ContentItem::getSection,
                        LinkedHashMap::new, Collectors.toList()));

        Map<String, String> text = new LinkedHashMap<>();
        for (SiteText t : textRepository.findAllByOrderByContentKeyAsc()) {
            text.put(t.getContentKey(), t.getValue());
        }

        return ResponseEntity.ok()
                .header("Cache-Control", "public, max-age=60")
                .body(Map.of("items", grouped, "text", text));
    }

    /* ──────────────────────────────── admin ─────────────────────────────── */

    /** Admin listing: includes inactive rows so they can be switched back on. */
    @GetMapping("/admin/items")
    public ResponseEntity<List<ContentItem>> allItems(@RequestParam(required = false) String section) {
        return ResponseEntity.ok(section == null || section.isBlank()
                ? itemRepository.findAllByOrderBySectionAscSortOrderAsc()
                : itemRepository.findBySectionOrderBySortOrderAsc(section));
    }

    /** The distinct sections that exist, so the admin UI can offer them. */
    @GetMapping("/admin/sections")
    public ResponseEntity<List<String>> sections() {
        return ResponseEntity.ok(itemRepository.findAll().stream()
                .map(ContentItem::getSection)
                .distinct()
                .sorted()
                .toList());
    }

    @PostMapping("/admin/items")
    public ResponseEntity<?> createItem(@Valid @RequestBody ContentItem item) {
        if (item.getSection() == null || item.getSection().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Section is required"));
        }
        item.setId(null);
        if (item.getSortOrder() == null) item.setSortOrder(0);
        if (item.getActive() == null) item.setActive(true);
        return ResponseEntity.status(HttpStatus.CREATED).body(itemRepository.save(item));
    }

    @PutMapping("/admin/items/{id}")
    public ResponseEntity<?> updateItem(@PathVariable Long id, @RequestBody ContentItem incoming) {
        return itemRepository.findById(id)
                .<ResponseEntity<?>>map(existing -> {
                    // Field-by-field rather than saving `incoming` wholesale, so a
                    // partial payload cannot silently blank out columns it omitted.
                    if (incoming.getSection() != null && !incoming.getSection().isBlank()) {
                        existing.setSection(incoming.getSection());
                    }
                    existing.setTitle(incoming.getTitle());
                    existing.setBody(incoming.getBody());
                    existing.setIcon(incoming.getIcon());
                    existing.setLink(incoming.getLink());
                    existing.setExtra(incoming.getExtra());
                    if (incoming.getSortOrder() != null) existing.setSortOrder(incoming.getSortOrder());
                    if (incoming.getActive() != null) existing.setActive(incoming.getActive());
                    return ResponseEntity.ok(itemRepository.save(existing));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Content item " + id + " not found")));
    }

    @DeleteMapping("/admin/items/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        if (!itemRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Content item " + id + " not found"));
        }
        itemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/admin/text")
    public ResponseEntity<List<SiteText>> allText() {
        return ResponseEntity.ok(textRepository.findAllByOrderByContentKeyAsc());
    }

    /**
     * Update a value by key.
     *
     * Only the value is editable. Keys are what the components ask for by name,
     * so letting an admin rename one would leave the page requesting text that
     * no longer exists — a blank headline with no obvious cause.
     */
    @PutMapping("/admin/text/{key}")
    public ResponseEntity<?> updateText(@PathVariable("key") @NotBlank String key,
                                        @RequestBody Map<String, String> payload) {
        return textRepository.findByContentKey(key)
                .<ResponseEntity<?>>map(existing -> {
                    existing.setValue(payload.get("value"));
                    return ResponseEntity.ok(textRepository.save(existing));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "No site text with key " + key)));
    }
}
