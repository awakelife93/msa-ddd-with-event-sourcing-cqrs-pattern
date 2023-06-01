class GetAllPostRequestDTO {
    id?: string;
    title?: string;
    content?: string;
    author_name?: string;

    constructor({
        id,
        title,
        content,
        author_name
    }: {
        id?: string;
        title?: string;
        content?: string;
        author_name?: string;
    }) {
        this.id = id ?? "";
        this.title = title ?? "";
        this.content = content ?? "";
        this.author_name = author_name ?? "";
    }
}

export default GetAllPostRequestDTO;
