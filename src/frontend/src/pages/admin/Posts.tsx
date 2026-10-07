import { PostCategory } from "@/backend";
import { EmptyState, ErrorState, LoadingState } from "@/components/States";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreatePost,
  useDeletePost,
  usePosts,
  useUpdatePost,
} from "@/hooks/use-backend";
import type { Post } from "@/lib/api";
import { formatDate, postCategoryLabels } from "@/lib/format";
import { Newspaper, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";

interface PostForm {
  title: string;
  body: string;
  imageUrl: string;
  category: PostCategory;
  published: boolean;
}

const emptyForm: PostForm = {
  title: "",
  body: "",
  imageUrl: "",
  category: PostCategory.announcement,
  published: true,
};

type CategoryFilter = PostCategory | "all";

export function AdminPostsPage() {
  const posts = usePosts();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState<PostForm>(emptyForm);
  const [pendingDelete, setPendingDelete] = useState<Post | null>(null);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(post: Post) {
    setEditing(post);
    setForm({
      title: post.title,
      body: post.body,
      imageUrl: post.imageUrl ?? "",
      category: post.category,
      published: post.published,
    });
    setOpen(true);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = {
      title: form.title.trim(),
      body: form.body.trim(),
      imageUrl: form.imageUrl.trim() === "" ? null : form.imageUrl.trim(),
      category: form.category,
      published: form.published,
    };
    if (editing) {
      updatePost.mutate(
        { ...payload, id: editing.id },
        {
          onSuccess: () => {
            toast.success("Post updated");
            setOpen(false);
          },
          onError: () => toast.error("Could not update the post"),
        },
      );
    } else {
      createPost.mutate(payload, {
        onSuccess: () => {
          toast.success("Post created");
          setOpen(false);
        },
        onError: () => toast.error("Could not create the post"),
      });
    }
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    deletePost.mutate(pendingDelete.id, {
      onSuccess: () => {
        toast.success("Post deleted");
        setPendingDelete(null);
      },
      onError: () => toast.error("Could not delete the post"),
    });
  }

  const list = posts.data ?? [];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list.filter((post) => {
      const matchesCategory =
        categoryFilter === "all" || post.category === categoryFilter;
      const matchesQuery =
        q === "" ||
        post.title.toLowerCase().includes(q) ||
        post.body.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [list, query, categoryFilter]);
  const isSaving = createPost.isPending || updatePost.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Posts
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Promotions, announcements, and advertising content.
          </p>
        </div>
        <Button
          type="button"
          className="rounded-full shadow-ink"
          onClick={openCreate}
          data-ocid="admin_posts.add_button"
        >
          <Plus className="size-4" aria-hidden="true" />
          Add post
        </Button>
      </div>

      {posts.isLoading ? (
        <LoadingState label="Loading posts…" />
      ) : posts.isError ? (
        <ErrorState
          description="We couldn't load your posts. Please try again."
          action={
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => void posts.refetch()}
              data-ocid="admin_posts.retry_button"
            >
              Retry
            </Button>
          }
        />
      ) : list.length === 0 ? (
        <EmptyState
          icon={<Newspaper className="size-6" aria-hidden="true" />}
          title="No posts yet"
          description="Create a promotion or announcement to show on the public site."
          action={
            <Button
              type="button"
              className="rounded-full"
              onClick={openCreate}
              data-ocid="admin_posts.empty_add_button"
            >
              Add post
            </Button>
          }
        />
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[14rem] flex-1 sm:max-w-sm">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search posts…"
                aria-label="Search posts"
                className="pl-9"
                data-ocid="admin_posts.search_input"
              />
            </div>
            <Select
              value={categoryFilter}
              onValueChange={(value) =>
                setCategoryFilter(value as CategoryFilter)
              }
            >
              <SelectTrigger
                className="w-[11rem]"
                aria-label="Filter by category"
                data-ocid="admin_posts.category_filter"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {Object.values(PostCategory).map((category) => (
                  <SelectItem key={category} value={category}>
                    {postCategoryLabels[category]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={<Search className="size-6" aria-hidden="true" />}
              title="No matching posts"
              description="Try a different search term or category."
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {filtered.map((post, index) => (
                <Card
                  key={post.id.toString()}
                  data-ocid={`admin_posts.card.${index + 1}`}
                  className="rounded-2xl border shadow-subtle"
                >
                  <CardHeader>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="rounded-full uppercase tracking-wide"
                      >
                        {postCategoryLabels[post.category]}
                      </Badge>
                      <Badge
                        variant={post.published ? "default" : "outline"}
                        className="rounded-full uppercase tracking-wide"
                      >
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                      <span className="font-mono text-xs text-muted-foreground">
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                    <CardTitle className="font-display text-lg">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {post.body}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => openEdit(post)}
                        data-ocid={`admin_posts.edit_button.${index + 1}`}
                      >
                        <Pencil className="size-3.5" aria-hidden="true" />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full text-destructive hover:text-destructive"
                        onClick={() => setPendingDelete(post)}
                        data-ocid={`admin_posts.delete_button.${index + 1}`}
                      >
                        <Trash2 className="size-3.5" aria-hidden="true" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          data-ocid="admin_posts.dialog"
          className="max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle className="font-display">
              {editing ? "Edit post" : "Add post"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Update this post's content and visibility."
                : "Create a new promotion, announcement, or advertising post."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="post-title">Title</Label>
              <Input
                id="post-title"
                data-ocid="admin_posts.title_input"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="post-body">Body</Label>
              <Textarea
                id="post-body"
                data-ocid="admin_posts.body_textarea"
                value={form.body}
                onChange={(e) =>
                  setForm((f) => ({ ...f, body: e.target.value }))
                }
                rows={5}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="post-image">Image URL (optional)</Label>
              <Input
                id="post-image"
                data-ocid="admin_posts.image_input"
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, imageUrl: e.target.value }))
                }
                placeholder="/assets/images/example.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="post-category">Category</Label>
              <Select
                value={form.category}
                onValueChange={(value) =>
                  setForm((f) => ({ ...f, category: value as PostCategory }))
                }
              >
                <SelectTrigger
                  id="post-category"
                  data-ocid="admin_posts.category_select"
                  className="w-full"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PostCategory).map((category) => (
                    <SelectItem key={category} value={category}>
                      {postCategoryLabels[category]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <Label htmlFor="post-published" className="cursor-pointer">
                Published
              </Label>
              <Switch
                id="post-published"
                data-ocid="admin_posts.published_switch"
                checked={form.published}
                onCheckedChange={(checked) =>
                  setForm((f) => ({ ...f, published: checked }))
                }
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => setOpen(false)}
                data-ocid="admin_posts.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-full shadow-ink"
                disabled={isSaving}
                data-ocid="admin_posts.save_button"
              >
                {isSaving ? "Saving…" : "Save post"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(next) => {
          if (!next) setPendingDelete(null);
        }}
      >
        <AlertDialogContent data-ocid="admin_posts.delete_dialog">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Delete this post?
            </AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{pendingDelete?.title}&rdquo; will be removed from your
              public site. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="rounded-full"
              data-ocid="admin_posts.delete_cancel_button"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
              disabled={deletePost.isPending}
              data-ocid="admin_posts.delete_confirm_button"
            >
              {deletePost.isPending ? "Deleting…" : "Delete post"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
