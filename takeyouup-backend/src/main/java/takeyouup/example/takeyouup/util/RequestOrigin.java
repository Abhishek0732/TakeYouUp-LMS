package takeyouup.example.takeyouup.util;

import jakarta.servlet.http.HttpServletRequest;

import java.net.URI;

/**
 * Works out the origin the browser is actually on, so emailed links point back
 * at whatever host is serving the frontend — localhost, a LAN IP, a tunnel or a
 * real domain — instead of a hardcoded URL.
 *
 * Order of preference: the {@code Origin} header (sent on the XHR that triggered
 * the email), then {@code Referer}, then the proxy's forwarded headers, and
 * finally the configured fallback.
 */
public final class RequestOrigin {

    private RequestOrigin() {
    }

    public static String resolve(HttpServletRequest request, String fallback) {
        if (request != null) {
            String origin = trimSlash(request.getHeader("Origin"));
            if (isUsable(origin)) {
                return origin;
            }

            String fromReferer = originOf(request.getHeader("Referer"));
            if (isUsable(fromReferer)) {
                return fromReferer;
            }

            String forwardedHost = request.getHeader("X-Forwarded-Host");
            if (forwardedHost != null && !forwardedHost.isBlank()) {
                String proto = request.getHeader("X-Forwarded-Proto");
                if (proto == null || proto.isBlank()) {
                    proto = request.getScheme();
                }
                // A proxy chain can send a comma-separated list; the first is the client.
                return proto + "://" + forwardedHost.split(",")[0].trim();
            }
        }
        return trimSlash(fallback);
    }

    private static boolean isUsable(String value) {
        return value != null && !value.isBlank() && !"null".equalsIgnoreCase(value);
    }

    private static String originOf(String url) {
        if (url == null || url.isBlank()) {
            return null;
        }
        try {
            URI uri = URI.create(url);
            if (uri.getScheme() == null || uri.getHost() == null) {
                return null;
            }
            String port = uri.getPort() == -1 ? "" : ":" + uri.getPort();
            return uri.getScheme() + "://" + uri.getHost() + port;
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private static String trimSlash(String value) {
        return value == null ? null : value.trim().replaceAll("/+$", "");
    }
}
