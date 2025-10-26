"use client";

import { api } from "../../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { Button } from "~/components/shadcn/button";
import { Input } from "~/components/shadcn/input";
import { Textarea } from "~/components/shadcn/textarea";
import { Label } from "~/components/shadcn/label";
import { Card } from "~/components/shadcn/card";
import { Switch } from "~/components/shadcn/switch";

export default function Page() {
  const user = useQuery(api.auth.getCurrentUser);
  const createBlog = useMutation(api.blogs.addBlog);
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    description: "",
    url: "",
    public: false,
    listed: false,
    imageAlt: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 text-center">
          <h1 className="text-2xl font-bold text-destructive">Unauthorized</h1>
          <p className="text-muted-foreground mt-2">You must be logged in to create a blog post.</p>
        </Card>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Auto-generate URL from title if URL is empty
    if (field === "title" && !formData.url) {
      const url = value.toString().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      setFormData(prev => ({
        ...prev,
        url
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await createBlog({
        blog: {
          title: formData.title,
          content: formData.content,
          description: formData.description,
          url: formData.url || undefined,
          public: formData.public,
          listed: formData.listed,
          imageAlt: formData.imageAlt || undefined,
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create blog post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Create New Blog Post</h1>
          <p className="text-muted-foreground mt-2">
            Share your thoughts and ideas with the world.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter blog post title"
              required
            />
          </div>

          {/* URL */}
          <div className="space-y-2">
            <Label htmlFor="url">URL Slug</Label>
            <Input
              id="url"
              value={formData.url}
              onChange={(e) => handleInputChange("url", e.target.value)}
              placeholder="url-slug-for-your-post"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to auto-generate from title
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Brief description of your blog post"
              rows={3}
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              placeholder="Write your blog post content here..."
              rows={12}
              required
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Featured Image</Label>
            <div className="flex items-center gap-4">
            </div>
          </div>

          {/* Image Alt Text */}
          {imageId && (
            <div className="space-y-2">
              <Label htmlFor="imageAlt">Image Alt Text</Label>
              <Input
                id="imageAlt"
                value={formData.imageAlt}
                onChange={(e) => handleInputChange("imageAlt", e.target.value)}
                placeholder="Describe the image for accessibility"
              />
            </div>
          )}

          {/* Visibility Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Visibility Settings</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="public">Public</Label>
                <p className="text-sm text-muted-foreground">
                  Show this post on the home screen
                </p>
              </div>
              <Switch
                id="public"
                checked={formData.public}
                onCheckedChange={(checked) => handleInputChange("public", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="listed">Listed</Label>
                <p className="text-sm text-muted-foreground">
                  Allow access via public URL
                </p>
              </div>
              <Switch
                id="listed"
                checked={formData.listed}
                onCheckedChange={(checked) => handleInputChange("listed", checked)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title || !formData.content || !formData.description}
              className="flex-1"
            >
              {isSubmitting ? "Creating..." : "Create Blog Post"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}