'use client';

import { use, useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { ArrowLeft, SendHorizontalIcon } from 'lucide-react';
import { toast } from 'sonner';

import CommentAction from '@/components/CommentAction';
import CommentItem from '@/components/CommentItem';
import NavigationBar from '@/components/NavigationBar';
import PostDetail from '@/components/PostDetail';
import TopBar from '@/components/TopBar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import api from '@/lib/axios';
import { Comment, Post, User } from '@/types';

export default function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (loading) return;

    const focus = searchParams.get('focus');
    const commentId = searchParams.get('commentId');

    if (focus === 'comment') {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }

    if (commentId) {
      setTimeout(() => {
        const element = document.getElementById(`comment-${commentId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('bg-accent/40');
          setTimeout(() => element.classList.remove('bg-accent/40'), 2000);
        }
      }, 100);
    }
  }, [loading, searchParams]);

  const fetchData = async () => {
    try {
      const [postRes, commentsRes, userRes] = await Promise.all([
        api.get(`/posts/${resolvedParams.id}`),
        api.get(`/posts/${resolvedParams.id}/comments`),
        api.get('/user'),
      ]);
      setPost(postRes.data.data);
      setComments(commentsRes.data.data);
      setCurrentUser(userRes.data);
    } catch (error) {
      toast.error('Gagal memuat unggahan. Silakan coba lagi nanti.');
      router.push('/feed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [resolvedParams.id, router]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const response = await api.post(`/posts/${resolvedParams.id}/comments`, {
        content: commentText,
      });
      setComments([response.data.data, ...comments]);
      setCommentText('');
      toast.success('Komentar berhasil dikirim!');
    } catch (error) {
      toast.error('Gagal mengirim komentar. Silakan coba lagi nanti.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = (commentId: number) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!post) return null;

  return (
    <>
      <TopBar className="flex w-full items-center gap-3 p-4 text-xl font-semibold">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Kembali"
          onClick={() => router.back()}
        >
          <ArrowLeft size={20} />
        </Button>
        Unggahan
      </TopBar>

      <main className="xs:pb-[78px] flex items-center justify-center pb-[81px]">
        <div className="divide-border flex w-full max-w-xl flex-col divide-y divide-solid">
          <PostDetail post={post} onUpdate={fetchData} />

          <div className="flex w-full gap-3 px-4 py-6">
            {currentUser && (
              <Avatar className="size-9">
                <AvatarImage
                  asChild
                  src={currentUser.profile_picture_url || undefined}
                >
                  <Image
                    src={currentUser.profile_picture_url || ''}
                    alt={`Foto profil ${currentUser.username}`}
                    width={36}
                    height={36}
                  />
                </AvatarImage>
                <AvatarFallback>
                  {currentUser.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}

            <form
              onSubmit={handleCommentSubmit}
              className="flex flex-1 flex-col"
            >
              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  placeholder="Posting balasan anda"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="min-h-[60px] pr-9"
                  disabled={submittingComment}
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground hover:bg-accent focus-visible:ring-ring/50 absolute right-0 bottom-0 mx-2 my-1 rounded-lg"
                  type="submit"
                  disabled={!commentText.trim() || submittingComment}
                >
                  {submittingComment ? (
                    <Spinner className="size-4" />
                  ) : (
                    <SendHorizontalIcon size={20} />
                  )}
                  <span className="sr-only">Kirim balasan</span>
                </Button>
              </div>
            </form>
          </div>

          {comments.map((comment) => (
            <div
              key={comment.id}
              id={`comment-${comment.id}`}
              className="transition-colors duration-500"
            >
              <CommentItem comment={comment} onDelete={handleDeleteComment} />
            </div>
          ))}
        </div>
      </main>
      <NavigationBar />
    </>
  );
}
