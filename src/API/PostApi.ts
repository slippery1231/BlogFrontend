export function getPostsList() {
    const result = fetch("http://localhost:5104/api/posts");
    return result
}