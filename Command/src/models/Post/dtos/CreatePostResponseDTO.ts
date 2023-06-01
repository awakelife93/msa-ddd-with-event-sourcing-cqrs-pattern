class CreatePostResponseDTO {
    id: number;
    title: string;
    content: string;
    author_name: string;
    created_at: Date;
    updated_at: Date;
    deleted: boolean;

    constructor({
        id,
        title,
        content,
        author_name,
        created_at,
        updated_at,
        deleted
    }: {
        id: number;
        title: string;
        content: string;
        author_name: string;
        created_at: Date;
        updated_at: Date;
        deleted: boolean;
    }) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.author_name = author_name;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.deleted = deleted;
    }
}

export default CreatePostResponseDTO;
