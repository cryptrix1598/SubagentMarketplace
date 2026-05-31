"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  Settings,
  Eye,
  CheckCircle2,
  Loader2,
  ChevronRight,
  Package,
  Tag,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { publishAgent } from "@/actions/agent";
import { CATEGORIES, CATEGORY_LABELS, LICENSES, MAX_TAGS } from "@/lib/constants";
import { slugify } from "@/lib/utils";

const steps = [
  { id: "details", title: "Agent Details", icon: Package },
  { id: "content", title: "Content & Files", icon: FileText },
  { id: "settings", title: "Settings", icon: Settings },
  { id: "review", title: "Review & Publish", icon: Eye },
];

export function PublishPageClient() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    longDescription: "",
    category: "" as string,
    tags: [] as string[],
    tagInput: "",
    license: "MIT",
    version: "1.0.0",
    readme: "",
    installationInstructions: "",
    isPublic: true,
    systemPrompt: "",
    toolsConfig: "",
    slugManuallySet: false,
  });

  const updateForm = (updates: Partial<typeof form>) => {
    setForm((prev) => {
      const next = { ...prev, ...updates };
      if (updates.name && !prev.slugManuallySet) {
        next.slug = slugify(updates.name);
      }
      return next;
    });
  };

  const addTag = () => {
    const tag = form.tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag) && form.tags.length < MAX_TAGS) {
      updateForm({ tags: [...form.tags, tag], tagInput: "" });
    }
  };

  const removeTag = (tag: string) => {
    updateForm({ tags: form.tags.filter((t) => t !== tag) });
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      const result = await publishAgent({
        name: form.name,
        slug: form.slug,
        description: form.description,
        longDescription: form.longDescription || undefined,
        category: form.category,
        tags: form.tags,
        license: form.license,
        version: form.version,
        readme: form.readme || undefined,
        installationInstructions: form.installationInstructions || undefined,
        isPublic: form.isPublic,
      });

      if (result.success && result.data) {
        toast({
          title: "Agent published!",
          description: `${form.name} is now live on AgentHub.`,
        });
        router.push(`/dashboard`);
      } else {
        toast({
          title: "Publishing failed",
          description: result.error || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to publish agent",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return form.name && form.slug && form.description && form.category && form.tags.length > 0;
      case 1:
        return form.systemPrompt.length > 0;
      case 2:
        return form.version;
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Publish Agent</h1>
        <p className="mt-2 text-muted-foreground">
          Share your subagent with the Claude Code community.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="mb-8 flex items-center gap-2">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <button
              onClick={() => index < currentStep && setCurrentStep(index)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                index === currentStep
                  ? "bg-orange-500/10 text-orange-500"
                  : index < currentStep
                    ? "text-foreground"
                    : "text-muted-foreground",
              )}
            >
              {index < currentStep ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <step.icon className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">{step.title}</span>
            </button>
            {index < steps.length - 1 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </React.Fragment>
        ))}
      </div>

      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Step 1: Details */}
        {currentStep === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Agent Details</CardTitle>
              <CardDescription>Basic information about your agent.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Agent Name *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => updateForm({ name: e.target.value })}
                    placeholder="My Awesome Agent"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    value={form.slug}
                    onChange={(e) => updateForm({ slug: e.target.value, slugManuallySet: true })}
                    placeholder="my-awesome-agent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Short Description *</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => updateForm({ description: e.target.value })}
                  placeholder="A brief description of what your agent does..."
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground">{form.description.length}/500</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="longDescription">Long Description</Label>
                <Textarea
                  id="longDescription"
                  value={form.longDescription}
                  onChange={(e) => updateForm({ longDescription: e.target.value })}
                  placeholder="Detailed description with features, use cases, etc."
                  rows={6}
                  maxLength={10000}
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={form.category} onValueChange={(v) => updateForm({ category: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>License</Label>
                  <Select value={form.license} onValueChange={(v) => updateForm({ license: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LICENSES.map((lic) => (
                        <SelectItem key={lic.value} value={lic.value}>
                          {lic.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags *</Label>
                <div className="flex flex-wrap gap-2">
                  {form.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      <Tag className="h-3 w-3" />
                      {tag}
                      <button onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={form.tagInput}
                    onChange={(e) => updateForm({ tagInput: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    placeholder="Add a tag..."
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    Add
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">{form.tags.length}/{MAX_TAGS} tags</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Content */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Content & Files</CardTitle>
              <CardDescription>The core content that makes your agent work.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="systemPrompt">System Prompt *</Label>
                <Textarea
                  id="systemPrompt"
                  value={form.systemPrompt}
                  onChange={(e) => updateForm({ systemPrompt: e.target.value })}
                  placeholder="You are an expert assistant that..."
                  rows={12}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  This is the main prompt that defines your agent&apos;s behavior.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="toolsConfig">Tools Configuration (JSON)</Label>
                <Textarea
                  id="toolsConfig"
                  value={form.toolsConfig}
                  onChange={(e) => updateForm({ toolsConfig: e.target.value })}
                  placeholder='{ "tools": ["Read", "Write", "Bash"] }'
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="readme">README (Markdown)</Label>
                <Textarea
                  id="readme"
                  value={form.readme}
                  onChange={(e) => updateForm({ readme: e.target.value })}
                  placeholder="# My Agent\n\n## Features\n\n## Installation\n\n## Usage"
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="install">Installation Instructions</Label>
                <Textarea
                  id="install"
                  value={form.installationInstructions}
                  onChange={(e) => updateForm({ installationInstructions: e.target.value })}
                  placeholder="Special setup instructions, environment variables, etc."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Settings */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Configure version and visibility.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="version">Initial Version *</Label>
                <Input
                  id="version"
                  value={form.version}
                  onChange={(e) => updateForm({ version: e.target.value })}
                  placeholder="1.0.0"
                />
                <p className="text-xs text-muted-foreground">
                  Use semantic versioning (e.g., 1.0.0, 0.1.0)
                </p>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Public Agent</p>
                  <p className="text-sm text-muted-foreground">
                    Make your agent visible to everyone on the marketplace.
                  </p>
                </div>
                <Switch
                  checked={form.isPublic}
                  onCheckedChange={(v) => updateForm({ isPublic: v })}
                />
              </div>

              <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
                <div className="flex items-start gap-3">
                  <Shield className="mt-0.5 h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-medium">Security Validation</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Your agent will be automatically validated for security issues,
                      required files, and metadata completeness before publishing.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Review */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Review & Publish</CardTitle>
              <CardDescription>Review your agent before publishing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-xl border bg-card/50 p-6">
                <h3 className="text-xl font-bold">{form.name}</h3>
                <p className="mt-2 text-muted-foreground">{form.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge>{form.category}</Badge>
                  <Badge variant="outline">v{form.version}</Badge>
                  <Badge variant="outline">{form.license}</Badge>
                  {form.isPublic ? (
                    <Badge variant="success">Public</Badge>
                  ) : (
                    <Badge variant="secondary">Private</Badge>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-1">
                  {form.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="mt-4 rounded-lg bg-foreground/5 p-3 font-mono text-sm">
                  $ claude agent install @username/{form.slug}
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-green-500">Ready to publish</p>
                  <p className="text-sm text-muted-foreground">
                    Your agent passes all validation checks.
                  </p>
                </div>
              </div>

              <Button
                variant="gradient"
                size="xl"
                className="w-full"
                onClick={handlePublish}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-5 w-5" />
                )}
                {loading ? "Publishing..." : "Publish Agent"}
              </Button>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Navigation */}
      <div className="mt-6 flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          Back
        </Button>
        {currentStep < steps.length - 1 && (
          <Button
            variant="gradient"
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={!canProceed()}
          >
            Continue
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function cn(...inputs: (string | false | undefined)[]) {
  return inputs.filter(Boolean).join(" ");
}
