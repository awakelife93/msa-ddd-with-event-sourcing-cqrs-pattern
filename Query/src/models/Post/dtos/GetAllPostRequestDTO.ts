class GetAllPostRequestDTO {
    post_id?: number;
    title?: string;
    content?: string;
    author_name?: string;

    constructor({
        post_id,
        title,
        content,
        author_name
    }: {
        post_id?: number;
        title?: string;
        content?: string;
        author_name?: string;
    }) {
        this.post_id = post_id;
        this.title = title;
        this.content = content;
        this.author_name = author_name;
    }
}

export default GetAllPostRequestDTO;
