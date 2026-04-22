import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { MessageCircle, Send, Lock, ThumbsUp, Reply, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { commentService } from "../services/commentService";
import { AvatarPlaceholder } from "../../../components/ui/GenericPlaceholder";
import { cn } from "../../../utils/cn";
import { motion, AnimatePresence } from "motion/react";

/**
 * CommentsSection component for displaying and posting comments
 * @param {Object} props
 * @param {string} props.articleId
 */
export default function CommentsSection({ articleId }) {
  const { user, login } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [replyToId, setReplyToId] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    if (!articleId) return;

    setLoading(true);
    const unsubscribe = commentService.subscribeToComments(articleId, (data) => {
      setComments(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [articleId]);

  const handleSubmit = async (e, parentId = null) => {
    if (e) e.preventDefault();
    
    const text = parentId ? replyText : newComment;
    if (!user || !text.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await commentService.postComment(articleId, user, text.trim(), parentId);
      if (parentId) {
        setReplyText("");
        setReplyToId(null);
      } else {
        setNewComment("");
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (commentId, isAlreadyLiked) => {
    if (!user) return login();
    try {
      await commentService.toggleLike(articleId, commentId, user.uid, !isAlreadyLiked);
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Just now";
    const d = date.toDate ? date.toDate() : new Date(date);
    return format(d, "MMM d, h:mm a");
  };

  // Organize comments into root comments and replies
  const organizedComments = useMemo(() => {
    const roots = comments.filter(c => !c.parentId);
    const replies = comments.filter(c => c.parentId);
    
    return roots.map(root => ({
      ...root,
      replies: replies.filter(r => r.parentId === root.id)
    }));
  }, [comments]);

  return (
    <div className="mt-16 pt-12 border-t border-stone-200">
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-3xl font-serif font-bold text-stone-900 flex items-center italic">
          <MessageCircle className="w-8 h-8 mr-4 text-stone-900" />
          Comments ({comments.length})
        </h3>
      </div>

      {/* Post Comment Form */}
      <div className="mb-16">
        {user ? (
          <form onSubmit={(e) => handleSubmit(e)} className="relative group">
            <div className="flex items-start space-x-6">
              <AvatarPlaceholder name={user.displayName} src={user.photoURL} size="md" />
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Join the conversation..."
                  className="w-full bg-white border-stone-200 border-2 rounded-2xl p-6 text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-900 transition-all min-h-[120px] resize-none shadow-sm group-focus-within:shadow-md"
                  disabled={isSubmitting}
                />
                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    disabled={!newComment.trim() || isSubmitting}
                    className="inline-flex items-center px-8 py-3 bg-stone-900 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl active:scale-95"
                  >
                    {isSubmitting ? "Posting..." : (
                      <>
                        Post Comment
                        <Send className="w-4 h-4 ml-3" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-stone-50 border border-stone-200 rounded-[2rem] p-12 text-center shadow-inner">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
              <Lock className="w-8 h-8 text-stone-300" />
            </div>
            <h4 className="text-xl font-serif font-bold text-stone-900 mb-2">Exclusive for Baobab Community</h4>
            <p className="text-stone-500 font-light mb-8 max-w-sm mx-auto">Please sign in to share your perspectives and engage with our community's stories.</p>
            <button
              onClick={login}
              className="inline-flex items-center px-10 py-3.5 bg-stone-900 text-white text-xs font-bold uppercase tracking-[0.2em] rounded-full hover:bg-stone-800 transition-all shadow-lg active:scale-95"
            >
              Sign In to Continue
            </button>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-12">
        {loading ? (
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex space-x-6">
                <div className="w-16 h-16 bg-stone-100 rounded-full"></div>
                <div className="flex-1 space-y-4 py-2">
                  <div className="h-4 bg-stone-100 rounded w-1/4"></div>
                  <div className="h-20 bg-stone-50 rounded-2xl w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : organizedComments.length > 0 ? (
          organizedComments.map((comment) => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              user={user}
              replyToId={replyToId}
              replyText={replyText}
              setReplyText={setReplyText}
              setReplyToId={setReplyToId}
              handleSubmit={handleSubmit}
              handleLike={handleLike}
              login={login}
              formatDate={formatDate}
              isSubmitting={isSubmitting}
            />
          ))
        ) : (
          <div className="text-center py-20 bg-stone-50/50 rounded-[2rem] border border-dashed border-stone-200">
            <MessageCircle className="w-12 h-12 text-stone-200 mx-auto mb-4" />
            <p className="text-stone-400 font-serif italic text-lg">No voices here yet. Be the first to start the conversation.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Individual comment item component
 */
function CommentItem({ 
  comment, 
  isReply = false, 
  user, 
  replyToId, 
  replyText, 
  setReplyText, 
  setReplyToId, 
  handleSubmit, 
  handleLike, 
  login,
  formatDate,
  isSubmitting
}) {
  const isLiked = user && comment.likedBy?.includes(user.uid);
  const showReplyForm = replyToId === comment.id;

  return (
    <div className={cn("flex space-x-4", isReply && "ml-12 md:ml-16 mt-6")}>
      <AvatarPlaceholder 
        name={comment.authorName} 
        src={comment.authorAvatar} 
        size={isReply ? "sm" : "md"} 
      />
      <div className="flex-1">
        <div className="bg-stone-50 rounded-2xl p-4 md:p-6 border border-stone-100 hover:border-stone-200 transition-all shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-1">
            <span className="font-serif font-bold text-stone-900">
              {comment.authorName}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          <p className="text-stone-700 leading-relaxed text-sm md:text-base mb-4">
            {comment.content}
          </p>
          
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => handleLike(comment.id, isLiked)}
              className={cn(
                "flex items-center space-x-1.5 text-xs font-bold uppercase tracking-widest transition-colors",
                isLiked ? "text-red-500" : "text-stone-400 hover:text-stone-900"
              )}
            >
              <ThumbsUp className={cn("w-4 h-4", isLiked && "fill-current")} />
              <span>{comment.likes || 0}</span>
            </button>
            
            {!isReply && (
              <button 
                onClick={() => user ? setReplyToId(showReplyForm ? null : comment.id) : login()}
                className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors"
              >
                <Reply className="w-4 h-4" />
                <span>Reply</span>
              </button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showReplyForm && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 ml-4"
            >
              <div className="flex items-start space-x-3">
                <AvatarPlaceholder name={user?.displayName} src={user?.photoURL} size="sm" />
                <div className="flex-1">
                  <textarea
                    autoFocus
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Replying to ${comment.authorName}...`}
                    className="w-full bg-stone-50 border-stone-200 border rounded-xl p-3 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all min-h-[80px] resize-none"
                  />
                  <div className="flex justify-end mt-2 space-x-2">
                    <button
                      onClick={() => setReplyToId(null)}
                      className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSubmit(null, comment.id)}
                      disabled={!replyText.trim() || isSubmitting}
                      className="inline-flex items-center px-4 py-1.5 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                      {isSubmitting ? "Posting..." : "Post Reply"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Render Replies */}
        {comment.replies?.length > 0 && (
          <div className="border-l-2 border-stone-100 ml-4 pl-4 mt-4 space-y-6">
            {comment.replies.map(reply => (
              <CommentItem 
                key={reply.id} 
                comment={reply} 
                isReply={true} 
                user={user}
                replyToId={replyToId}
                replyText={replyText}
                setReplyText={setReplyText}
                setReplyToId={setReplyToId}
                handleSubmit={handleSubmit}
                handleLike={handleLike}
                login={login}
                formatDate={formatDate}
                isSubmitting={isSubmitting}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
