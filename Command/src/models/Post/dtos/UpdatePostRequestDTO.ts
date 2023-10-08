class UpdatePostRequestDTO {
  title: string;
  content: string;
  author_name: string;

  constructor({
    title,
    content,
    author_name,
  }: {
    title: string;
    content: string;
    author_name: string;
  }) {
    this.title = title;
    this.content = content;
    this.author_name = author_name;
  }
}

export default UpdatePostRequestDTO;
