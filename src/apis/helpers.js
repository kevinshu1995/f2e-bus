export function serialize(params = {}) {
    let result = [];
    for (const [key, value] of Object.entries(params)) {
        result.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
    return result.join("&");
}
