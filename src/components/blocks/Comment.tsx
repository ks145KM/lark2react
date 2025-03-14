interface CommentProps {
    commentId: string;
}

export function Comment({ commentId }: CommentProps) {
    return (<div>Comment ID: {commentId}</div>);
}

//idの全体のリストをusestateかなんかで管理して、そのリストを受け渡す
export function CommentList({ commentIdList }: { commentIdList: string[] }) {
  
    
    if (!commentIdList) {
        return <div>No comments available</div>;
    }
    return (
        <div>
            {commentIdList.map((commentId, index) => (
                <Comment key={index} commentId={commentId} />
            ))}
        </div>
    );
}

