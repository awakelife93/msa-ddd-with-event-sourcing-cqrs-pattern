class UpdatePostResponseDTO {
  id: number;
  post_id: number;
  title: string;
  content: string;
  author_name: string;
  created_at: Date;
  deleted: boolean;
  version: number;

  constructor({
    id,
    post_id,
    title,
    content,
    author_name,
    created_at,
    deleted,
    version,
  }: {
    id: number;
    post_id: number;
    title: string;
    content: string;
    author_name: string;
    created_at: Date;
    deleted: boolean;
    version: number;
  }) {
    this.id = id;
    this.post_id = post_id;
    this.title = title;
    this.content = content;
    this.author_name = author_name;
    this.created_at = created_at;
    this.deleted = deleted;
    this.version = version;
  }
}

export default UpdatePostResponseDTO;
