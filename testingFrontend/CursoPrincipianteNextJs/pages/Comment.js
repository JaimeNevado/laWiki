

export default function Comment(){
    const comment = {
        "date": "2024-10-12T20:13:34.342345",
        "title": "some title",
        "body": "some comment",
        "article_id": "2q341314",
        "author_id": "123124a",
        "author": "pepe"
    }
    return (
        <div>
            <h2>{comment.title}</h2>

            <div>
                <p><strong>Date:</strong> {new Date(comment.date).toLocaleString()}</p>
            </div>

            <p>{comment.body}</p>
            <p>{comment.author}</p>
        </div>
    );
}